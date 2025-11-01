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
import { ref } from "vue";
import { getCurrentWindow, Theme } from "@tauri-apps/api/window";
import { setTheme } from "@tauri-apps/api/app";
import { settings } from "../stores/settings";

const theme = ref(await getCurrentWindow().theme())

if (settings.theme) {
	theme.value = settings.theme
	setThemes(settings.theme)
} 

async function setThemes(newTheme: Theme) {
	await setTheme(newTheme);
	await getCurrentWindow().setTheme(newTheme);
	theme.value = await getCurrentWindow().theme()
	settings.theme = newTheme;
}
</script>

<template>
	<a @click="theme == 'dark' ? setThemes('light') : setThemes('dark')" id="theme-switcher" >{{ theme == "dark" ? "☀" : "☾" }}</a>
</template>
