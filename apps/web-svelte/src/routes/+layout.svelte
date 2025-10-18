<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import { setContextClient } from "@urql/svelte";
  import { urqlClient } from "client-graphql";
  import "client-css/global.scss";

  setContextClient(urqlClient);
</script>

<Nav />

<slot />
