import { building } from "$app/environment";

if (!building) {
  import("varlock/auto-load");
}
