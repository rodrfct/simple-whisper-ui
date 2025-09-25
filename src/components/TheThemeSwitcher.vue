<script setup lang="ts">
import { ref } from "vue";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { setTheme } from "@tauri-apps/api/app";

const theme = ref(await getCurrentWindow().theme())

async function toggleTheme() {
	if (theme.value == "dark") {
		await setTheme("light");
		await getCurrentWindow().setTheme("light");
	} else {
		await setTheme("dark"); 
		await getCurrentWindow().setTheme("dark");

	}

	theme.value = await getCurrentWindow().theme()
	console.log(theme.value)
}
</script>

<template>
	<a @click="toggleTheme" id="theme-switcher">{{ theme == "dark" ? "☀" : "☾" }}</a>
</template>
