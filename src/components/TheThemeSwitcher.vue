<script setup lang="ts">
import { ref } from "vue";
import { getCurrentWindow, Theme } from "@tauri-apps/api/window";
import { setTheme } from "@tauri-apps/api/app";
import { exists, writeTextFile, readTextFile, mkdir } from "@tauri-apps/plugin-fs";
import { appConfigDir, join } from "@tauri-apps/api/path";
import { SettingsType } from "../App.vue";

const theme = ref(await getCurrentWindow().theme())

const settingsFilePath = await join(await appConfigDir(), "settings.json")

let settings: SettingsType

if (await exists(settingsFilePath)) {
	settings = JSON.parse(await readTextFile(settingsFilePath))
	theme.value = settings.theme
	setThemes(settings.theme)
} else if (!exists(await appConfigDir())) {
	await mkdir(await appConfigDir())
}

async function setThemes(newTheme: Theme) {
	await setTheme(newTheme);
	await getCurrentWindow().setTheme(newTheme);
	theme.value = await getCurrentWindow().theme()
}

async function toggleTheme() {
	if (theme.value == "dark") {
		if (settings) {
			settings.theme = "light"
			await writeTextFile(settingsFilePath, JSON.stringify(settings, null, 2))
		} else {
			await writeTextFile(settingsFilePath, JSON.stringify({theme: "light"}, null, 2))
		}

		setThemes("light")

	} else {
		if (settings) {
			settings.theme = "dark"
			await writeTextFile(settingsFilePath, JSON.stringify(settings, null, 2))
		} else {
			await writeTextFile(settingsFilePath, JSON.stringify({theme: "dark"}, null, 2))
		}

		setThemes("dark")

	}
}
</script>

<template>
	<a @click="toggleTheme" id="theme-switcher">{{ theme == "dark" ? "☀" : "☾" }}</a>
</template>
