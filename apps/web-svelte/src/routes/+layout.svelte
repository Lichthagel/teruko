<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import "../app.css";
  import "@fontsource-variable/m-plus-2";
  import "@fontsource-variable/sora";
  import { setContextClient } from "@urql/svelte";
  import { urqlClient } from "client-common";

  setContextClient(urqlClient);
</script>

<Nav />

<slot />
