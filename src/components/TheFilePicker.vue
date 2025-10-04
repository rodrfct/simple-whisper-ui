<script setup lang="ts">
import { invoke } from '@tauri-apps/api/core';
import { pickedFile } from '../stores/pickedFile';

async function pickFile() {
	const filePath: string | null = await invoke('pick_file')
	if (filePath) {
		pickedFile.value = filePath;
	}
}
</script>
<template>
	<button @click="pickFile" type="button">
		{{ pickedFile ? pickedFile : "Pick a file to transcribe!" }}
	</button>
</template>

<style scoped>
button {
	background-color: var(--primary);
	border: none;
	border-radius: 5px;
	color: inherit;

	box-sizing: content-box;
	padding: .8em 1.5em;
	max-width: 15em;
	max-height: 1lh;
	white-space: nowrap;
	overflow: scroll;
}
</style>
