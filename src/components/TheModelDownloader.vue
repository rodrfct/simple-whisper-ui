<!--     Copyright (C) 2025 rodrfct <rodrigoca.fct@gmail.com> -->
<!---->
<!--     This program is free software: you can redistribute it and/or modify -->
<!--     it under the terms of the GNU General Public License as published by -->
<!--     the Free Software Foundation, either version 3 of the License, or -->
<!--     (at your option) any later version. -->
<!---->
<!--     This program is distributed in the hope that it will be useful, -->
<!--     but WITHOUT ANY WARRANTY; without even the implied warranty of -->
<!--     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the -->
<!--     GNU General Public License for more details. -->
<!---->
<!--     You should have received a copy of the GNU General Public License -->
<!--     along with this program.  If not, see <https://www.gnu.org/licenses/>. -->



<script setup lang="ts">
import { appDataDir, join } from "@tauri-apps/api/path";
import { open, exists, mkdir, remove } from "@tauri-apps/plugin-fs";
import { useTemplateRef, ref, watch } from "vue";
import { getSettings, setSettings, Settings } from "../lib/settings";

interface ModelCard {
	name: string;
	description?: string;
	url: string;
	progress?: number;
	abortController?: AbortController;
}

const downloaderModal = useTemplateRef("downloader-modal");

const models = ref<ModelCard[]>([
	{
		name: "Tiny",
		description: "Recommended for low spec devices",
		url: "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin?download=true"
	},
	{
		name: "Small",
		url: "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin?download=true",
	},
	{
		name: "Base",
		url: "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin?download=true",
	},
	{
		name: "Medium",
		url: "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin?download=true",
	},
	{
		name: "Large",
		description: "Recommended for powerful devices",
		url: "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3.bin?download=true",
	},
]);

// Filesystem path for the models
const modelsDir = await join(await appDataDir(), 'whisper')

if (!await exists(modelsDir)) {
	await mkdir(modelsDir, {recursive: true})
}

// Check if anything is being downloaded
const isDownloading = ref(false)

watch(() => models.value, (newModels) => {
	for (const model of newModels) {
		if (model.progress == 100) {isDownloading.value = false}
		if (model.progress && model.progress != 100) {isDownloading.value = true}
	}
}, {deep: true})



async function fetchModel(modelCard: ModelCard) {

	if (modelCard.progress && modelCard.progress < 100) return;

	const filePath = await join(modelsDir, `${modelCard.name}.bin`)

	modelCard.abortController = new AbortController();

	// Fetch the model
	const model = await fetch(modelCard.url, {
		method: "GET",
		signal: modelCard.abortController.signal
	},);
	
	if (!model.body) {
		throw new Error("No body")
	}

	const reader = model.body.getReader()

	try {
		await remove(filePath);
	} catch {}

	// Create file
	const modelFile = await open(filePath, {
		append: true,
		create: true
	})

	const contentLength = parseInt(model.headers.get('content-length') || "0")
	let received = 0;

	// Handle abortion
	modelCard.abortController.signal.addEventListener('abort', () => {
		reader.cancel();
		alert("Download cancelled")
	})

	// Read the stream and write to disk
	try {
		while (true) {
			const {done, value} = await reader.read();
			if (done) break;

			const chunkBytes = (value && (value.byteLength ?? value.length)) || 0;
			received += chunkBytes;
			modelCard.progress = Math.round(received / contentLength * 100)
			await modelFile.write(value)
		}
	} finally {
		reader.releaseLock?.();
		modelFile.close();
		setModel(filePath)
	}
}

function cancelDownload(model: ModelCard) {
	model.abortController?.abort();
	model.progress = 0
}

async function setModel(modelPath: string) {
	let settings: Settings = await getSettings()

	settings.model = modelPath;
	setSettings(settings)

}

function closeModal() {if (!isDownloading.value) {downloaderModal.value?.close()}}
</script>

<template>
	<svg
		@click="downloaderModal?.showModal()"
		id="model-downloader"
		class="corner-icon"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 16L12 8"
			stroke="var(--text)"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M9 13L11.913 15.913V15.913C11.961 15.961 12.039 15.961 12.087 15.913V15.913L15 13"
			stroke="var(--text)"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M3 15L3 16L3 19C3 20.1046 3.89543 21 5 21L19 21C20.1046 21 21 20.1046 21 19L21 16L21 15"
			stroke="var(--text)"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>

	<dialog ref="downloader-modal" @cancel.prevent="closeModal">
		<div class="hint">
			<span>Fastest</span>
			<div id="line"></div>
			<span>Most accurate</span>
		</div>

		<div id="models">
			<div
				v-for="model in models"
				:key="model.name"
				@click="fetchModel(model)"
				class="model"
			>
				<span>{{ model.name }}</span>
				<p v-if="model.description" >{{ model.description }}</p>

				<div class="progress">
					<div v-if="model.progress" class="remaining">
						<div class="received" :style="{ width: `${model.progress}%` }"></div>
					</div>
					<button v-if="model.progress && model.progress < 100" @click.stop="cancelDownload(model)">Cancel</button>
				</div>
			</div>
		</div>

		<form action="dialog" @submit.prevent="closeModal">
			<button>{{ isDownloading ? "Downloading, please wait" : "Exit" }}</button>
		</form>
	</dialog>
</template>

<style scoped>
dialog {
	grid-template-columns: auto 1fr;
	grid-template-rows: 1fr auto;
	gap: 5px;

	&[open] {
		display: grid;
	}

	form {
		grid-column: 1/-1;

		& button {
			width: 100%;
		}
	}
}

#models {
	display: flex;
	flex-direction: column;
	gap: 5px;
	overflow-y: scroll;
}

.hint {
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	font-size: 0.75rem;
	font-weight: 500;

	& #line {
		width: 2px;
		border: 1px solid var(--text);
		height: 100%;
		align-self: center;
	}
}

.model {
	box-sizing: content-box;

	display: flex;
	flex-direction: column;
	justify-content: center;

	background-color: var(--secondary);
	flex-grow: 1;
	padding: 0.8em;
	border: 1px solid var(--primary);
	border-radius: 5px;

	cursor: pointer;
	transition: all 0.5s ease;

	& span {
		font-weight: 600;
		font-size: 1.2em;
	}

	& p {
		margin: 0;
	}

	&:hover {
		border-color: var(--accent);
		filter: brightness(120%);
	}
}

.progress {
	margin: .5em 0;
	display: flex;
	align-items: center;
	gap: 1em;
}

.remaining {
	background-color: gray;
	width: 100%;
}

.received {
	background-color: var(--accent);
}

.remaining,.received {
	height: 5px;
}
</style>
