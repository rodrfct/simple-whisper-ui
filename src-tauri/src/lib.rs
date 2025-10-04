use tauri::{ AppHandle, Manager };
use tauri_plugin_dialog::{ DialogExt, FilePath };

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
