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
