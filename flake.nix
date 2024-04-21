{
  description = "Teruko";

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aaarch64-darwin"
      ];
      eachSystems =
        f:
        nixpkgs.lib.genAttrs systems (
          system:
          f {
            inherit system;
            pkgs = nixpkgs.legacyPackages.${system};
          }
        );
    in
    {
      devShells = eachSystems (
        { pkgs, ... }:
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              nodejs
              nodePackages.pnpm
            ];
          };
        }
      );
    };

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
  };
}
