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
import { appConfigDir, join } from "@tauri-apps/api/path";
import { Theme } from "@tauri-apps/api/window";

export interface Settings {
	theme: Theme | null,
	model?: string,
	timestamps?: boolean
}

const settingsFilePath = await join(await appConfigDir(), "settings.json")

export async function getSettings(): Promise<Settings> {
	if (await exists(settingsFilePath)) {
		return JSON.parse(await readTextFile(settingsFilePath))
	} else {
		return {theme: null}
	}

}

export async function setSettings(newSettings: Settings) {
	try {
		await writeTextFile(settingsFilePath, JSON.stringify(newSettings, null, 2))
	} catch {
		if (!await exists(await appConfigDir())) {await mkdir(await appConfigDir())}
		setSettings(newSettings)
	}
}

