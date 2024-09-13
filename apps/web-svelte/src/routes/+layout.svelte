<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import "@fontsource-variable/m-plus-2";
  import "@fontsource-variable/sora";
  import { setContextClient } from "@urql/svelte";
  import { urqlClient } from "client-graphql";

  import "../app.css";

  setContextClient(urqlClient);
</script>

<Nav />

<slot />
