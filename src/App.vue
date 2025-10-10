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
import { Theme } from "@tauri-apps/api/window";
import TheFilePicker from "./components/TheFilePicker.vue";
import TheOutput from "./components/TheOutput.vue";
import TheThemeSwitcher from "./components/TheThemeSwitcher.vue";
import { pickedFile } from "./stores/pickedFile";

export interface SettingsType {
	theme: Theme,
	model?: string,
	timestamps?: boolean
}
</script>

<template>
  <main class="container">
    <h1>Simple transcription</h1>

	<p>Transcribe audio files easily with OpenAI's Whisper</p>

	<TheFilePicker />

	<TheOutput />
	<Suspense>
		<TheThemeSwitcher />
	</Suspense>

  </main>
</template>

<style scoped>
#theme-switcher {
	position: fixed;
	top: 5%;
	right: 6%;
	font-size: 1.5rem;
	cursor: pointer;
}
</style>
