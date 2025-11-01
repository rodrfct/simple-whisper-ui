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
import TheFilePicker from "./components/TheFilePicker.vue";
import TheOutput from "./components/TheOutput.vue";
import TheThemeSwitcher from "./components/TheThemeSwitcher.vue";
import { pickedFile } from "./stores/pickedFile";
import TheModelDownloader from "./components/TheModelDownloader.vue";
import Settings from "./components/Settings.vue";

</script>

<template>
  <main class="container">
    <h1>Simple transcription</h1>

	<p>Transcribe audio files easily with OpenAI's Whisper</p>

	<TheFilePicker />

	<TheOutput />

	<div id="preferences" class="corner-icon">

		<Suspense>
			<TheThemeSwitcher />
		</Suspense>

		<Suspense>
			<Settings />
		</Suspense>
	</div>

	<Suspense>
		<TheModelDownloader />
	</Suspense>

  </main>
</template>

<style>
.corner-icon {
	position: fixed;
	top: 5%;
	right: 5%;
	font-size: 1.5rem;
	cursor: pointer;
}

#preferences {
	display: flex;
	gap: .4em;
}

#model-downloader {
	left: 5%;
	width: 1em;
}

button {
	background-color: var(--primary);
	padding: .8em 1.5em;
	border: 2px solid var(--primary);
	border-radius: 5px;
	color: var(--text);

	cursor: pointer;
	transition: border .5s ease, filter .5s ease;

	&:hover {
		border-color: var(--accent);
		filter: brightness(120%);
	}
}

dialog {
	position: fixed;
	top: 50%;
	left: 50%;
	translate: -50% -50%;
	width: 70%;

	background-color: var(--background);
	color: inherit;
	border: 1px solid var(--accent);
	border-radius: 12px;

}
</style>
