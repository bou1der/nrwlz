{
  description = "A dev environment for nx monorepo";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      # inference-sdk = pkgs.python310Packages.buildPythonPackage rec {
      #   pname = "inference-sdk";
      #   version = "0.57.2";
      #   format = "wheel"; # Используем wheel для упрощения
      #
      #   src = pkgs.fetchPypi {
      #     inherit pname version;
      #     format = "wheel";
      #     python = "py3";
      #     dist = "py3";
      #     sha256 = "sha256-3aL0Z0+1nA8tW+1zX0Z1Y2zX3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2"; # Замените на актуальный SHA256
      #   };
      #
      #   # Зависимости inference-sdk
      #   propagatedBuildInputs = with pkgs.python310Packages; [
      #     aiohttp
      #     backoff
      #     dataclasses-json
      #     numpy
      #     opencv-python
      #     pillow
      #     requests
      #   ];
      #
      #   # Отключаем проверку Python-версии (если нужно)
      #   prePatch = ''
      #     substituteInPlace setup.py \
      #       --replace "requires-python:>=3.9,<3.13" "requires-python:>=3.9"
      #   '';
      #
      #   meta = with pkgs.lib; {
      #     description = "Roboflow Inference SDK for computer vision tasks";
      #     homepage = "https://github.com/roboflow/inference";
      #     license = licenses.mit;
      #   };
      # };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs_22
          pnpm
          git
          (python312.withPackages (
            env: with env; [
              pip
              pipx
              virtualenv
              # inference-sdk
            ]
          ))

        ];

        shellHook = ''
          # source apps/uploader/bin/activate
          # ${pkgs.python312Packages.pip}/bin/pip install -r apps/uploader/requirements.txt --break-system-packages
          export PATH="$PWD/node_modules/.bin:$PATH"

          if [ ! -d "node_modules/nx" ]; then
            pnpm install
          fi

          alias dev="nx run-many -t serve --all"
          alias typecheck="nx run-many -t lint typecheck  --all"
        '';
      };

      devShells.aarch64-darwin.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs_22
          pnpm
          git
        ];

        shellHook = ''
          export PATH="$PWD/node_modules/.bin:$PATH"

          if [ ! -d "node_modules/nx" ]; then
            pnpm install
          fi

          alias dev="nx run-many -t serve --all"
          alias typecheck="nx run-many -t lint typecheck  --all"
        '';
      };
    };
}
