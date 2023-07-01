<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import "../app.css";
  import "@fontsource/readex-pro";
  import "@fontsource/m-plus-1";
  import { setContextClient } from "@urql/svelte";
  import { urqlClient } from "client-common";

  setContextClient(urqlClient);
</script>

<Nav />

<slot />
