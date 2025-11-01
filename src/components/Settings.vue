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
import { ref, useTemplateRef, onMounted, onBeforeUnmount } from 'vue';
import { settings, settingsSchema } from '../stores/settings';

const settingsDialog = useTemplateRef('settings-dialog')
const settingsIcon = useTemplateRef('settings-icon')

const customWhisper = ref(!settingsSchema.model?.options.some(obj => obj.value == settings.model))

function handleClick(e: MouseEvent) {
    const icon = settingsIcon.value!.getBoundingClientRect();
	if (icon.top <= e.clientY &&
		e.clientY <= icon.bottom &&
		icon.left <= e.clientX &&
		e.clientX <= icon.right) {return}

    const rect = settingsDialog.value!.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.bottom &&
      rect.left <= e.clientX &&
      e.clientX <= rect.right;

    if (!isInDialog) {
      settingsDialog.value!.close();
    }
};

function handleEsc(e: KeyboardEvent) {if (e.key == "Escape") {settingsDialog.value?.close()}}

onMounted(() => {
	document.addEventListener('click', handleClick)
	document.addEventListener('keypress', handleEsc)
})

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClick)
	document.removeEventListener('keypress', handleEsc)
})
</script>

<template>
	<a @click="settingsDialog?.show()" ref="settings-icon">⚙︎</a>

	<dialog ref="settings-dialog">
		<form action="dialog">
			<div class="fields">
				<div
					v-for="(schema, key) in settingsSchema"
					:key="key"
					class="field"
				>
					<label :for="key">{{ schema!.label }}</label>
					<select v-model="settings[key]" v-if="!(schema!.label == 'Model' && customWhisper)" :id="key">
						<option
							v-for="opt in schema!.options"
							:key="opt.value"
							:value="opt.value"
						>
							{{ opt.label }}
						</option>
					</select>
					<input v-else v-model.lazy="settings.model" type="text" placeholder="~/custom_whisper_models/mycustomwhisper.bin">

					<div v-if="schema!.label == 'Model'" class="switch-button">
						<span>Use custom model path: </span>
						<span v-show="customWhisper">(Simple whisper UI can only access it's data folder for now)</span>
						<input type="checkbox" v-model="customWhisper" name="switch-button" id="switch-label">
						<label for="switch-label"></label>
					</div>
				</div>
			</div>

			<button>Save & exit</button>
		</form>
	</dialog>
</template>

<style scoped>
.fields {
	overflow-y: scroll;
}
/* TODO Use container query to switch to a single column desing on small screens */
.field {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-auto-flow: row;
	align-items: center;
	column-gap: 5px;

	background-color: var(--secondary);
	padding: 0.8em;
	border: 1px solid var(--primary);
	border-radius: 5px;
	cursor: initial;

	& label {
		font-weight: 500;
		text-align: left;
	}

	& select, input[type=text] {
		width: 100% !important;
		appearance: none;
		background-color: hsl(from var(--primary) h s l / .3);
		color: inherit;

		padding: .4rem;
		border: none;

		font-size: 1.2rem;
		width: 50%;

		cursor: pointer;
	}
}

button {
	margin-top: 5px;
	width: 100%;
}

.switch-button {
	display: flex;
	align-items: center;
	gap: 5px;

	& span {
		font-size: .7rem;
	}

	& input {
		appearance: none;
	}

	& label {
		background-color: var(--primary);
		aspect-ratio: 5 / 3;
		min-width: 2.5rem;
		border-radius: 3rem;
		display: inline-block;
		position: relative;

		&:before {
			transition: .2s;
			display: block;
			position: absolute;
			aspect-ratio: 1 / 1;
			width: 1.5rem;
			background-color: #fff;
			content: '';
			border-radius: 50%;
			border: 1px solid 000;
		}

	}

	& input:checked + label {
		background-color: var(--accent);
	}
	& input:checked + label:before {
		translate: 90% 0;
	}

}

.field:has(.switch-button) select, .field:has(.switch-button) input {
	grid-column: 2;
	grid-row: 1 / 3;
	height: 100%;
}

</style>
