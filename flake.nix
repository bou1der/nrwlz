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
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs_22
          pnpm
          git
          envsubst
          (python312.withPackages (
            env: with env; [
              pip
              pipx
              virtualenv
            ]
          ))

        ];

        shellHook = ''
          # source apps/uploader/bin/activate
          # ${pkgs.python312Packages.pip}/bin/pip install -r apps/uploader/requirements.txt
          export PATH="$PWD/node_modules/.bin:$PATH"

          if [ ! -d "node_modules/nx" ]; then
            pnpm install
          fi

          alias dev="nx run-many -t serve --all"
          alias typecheck="nx run-many -t lint typecheck  --all"
          alias k="${pkgs.kubernetes}/bin/kubectl"
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
          alias k="${pkgs.kubernetes}/bin/kubectl"
        '';
      };

    };
}
