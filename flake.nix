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
        ];

        shellHook = ''
          export PATH="$PWD/node_modules/.bin:$PATH"

          if [ ! -d "node_modules/nx" ]; then
            pnpm install
          fi

          alias dev="nx run-many --target=serve --all"
        '';
      };
    };
}
