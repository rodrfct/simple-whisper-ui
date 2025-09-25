<script setup lang="ts">
import TheFilePicker from "./components/TheFilePicker.vue";
import TheOutput from "./components/TheOutput.vue";
import TheThemeSwitcher from "./components/TheThemeSwitcher.vue";
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
