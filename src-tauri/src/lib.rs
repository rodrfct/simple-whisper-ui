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



use tauri::{AppHandle, Manager};
use tauri_plugin_dialog::{DialogExt, FilePath};

#[tauri::command]
async fn pick_file(app: AppHandle) -> Option<FilePath> {
    let win = app.get_webview_window("main").unwrap();
    let _ = win.set_enabled(false);
    let file_path = app.dialog().file().blocking_pick_file();
    let _ = win.set_enabled(true);

    return file_path
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![pick_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
