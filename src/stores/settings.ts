// Copyright (C) 2025 rodrfct <rodrigoca.fct@gmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.



import { exists, readTextFile, writeTextFile, mkdir } from "@tauri-apps/plugin-fs";
import { appConfigDir, appDataDir, join } from "@tauri-apps/api/path";
import { Theme } from "@tauri-apps/api/window";
import { reactive, watch } from "vue";
import { WhisperModel } from "../components/TheModelDownloader.vue";

interface Settings {
	theme: Theme | null,
	model?: WhisperModel,
	timestamps?: boolean
}

const configDir = await appConfigDir()
export const modelsDir = await join(await appDataDir(), 'whisper')
const settingsFilePath = await join(configDir, "settings.json")

type FieldLabelMap = {
	model: WhisperModel
}

type SettingsSchema = {
  [K in keyof Settings]: {
    label: string
    options: readonly {
      value: string,
      label: K extends keyof FieldLabelMap ? FieldLabelMap[K] : string
    }[]
  }
}


export const settingsSchema: SettingsSchema = {
	theme: {
		label: "Theme",
		options: [
			{ value: "light", label: "Light" },
			{ value: "dark", label: "Dark" },
			{ value: "", label: "System" },
		],
	},
	model: {
		label: "Model",
		options: [
			{ value: await join(modelsDir, "Tiny.bin"), label: "Tiny"},
			{ value: await join(modelsDir, "Small.bin"), label: "Small"},
			{ value: await join(modelsDir, "Base.bin"), label: "Base"},
			{ value: await join(modelsDir, "Medium.bin"), label: "Medium"},
			{ value: await join(modelsDir, "Large.bin"), label: "Large"}
		]
	},
	timestamps: {
		label: "Use timestamps",
		options: [
			{ value: "false", label: "No"},
			{ value: "true", label: "Yes"}
		]
	}


} as const satisfies Record<keyof Settings, {
    label: string
    options: readonly { value: string; label: string }[]
  }>


export const settings = reactive<Settings>(await exists(settingsFilePath) ? JSON.parse(await readTextFile(settingsFilePath)) : {theme: null} )

watch(settings, async (newVal) => {
	if (newVal.model && !await exists(newVal.model)) {
		alert("The model you selected could not be found in your filesystem. Please download it or select a different one")
		return
	}
	setSettings(newVal)
}, {deep: true})

async function setSettings(newSettings: Settings) {
	try {
		await writeTextFile(settingsFilePath, JSON.stringify(newSettings, null, 2))
	} catch {
		if (!await exists(await appConfigDir())) {await mkdir(await appConfigDir())}
		setSettings(newSettings)
	}
}

