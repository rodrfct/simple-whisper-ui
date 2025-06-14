{
  description = "Tauri devShell";

  inputs = {
    utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, rust-overlay, nixpkgs,  utils, ... }:
    utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ rust-overlay.overlays.default ];
      };
    in {

      devShells.default = pkgs.mkShell {
        packages = with pkgs; [
          (rust-bin.stable.latest.minimal.override {
            extensions = [
              "rust-src"
              "rust-analyzer"
            ];
          })
          cargo-tauri
          nodejs
          vscode-langservers-extracted
          typescript
          typescript-language-server
          vue-language-server
          pkg-config
          gobject-introspection
        ];

        buildInputs = with pkgs;[
          at-spi2-atk
          atkmm
          cairo
          gdk-pixbuf
          glib
          gtk3
          harfbuzz
          librsvg
          libsoup_3
          pango
          webkitgtk_4_1
          openssl
        ];

        shellHook = ''
          exec fish
        '';
      };

  });
}
