<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import { setContextClient } from "@urql/svelte";
  import "client-css/global.scss";
  import { urqlClient } from "client-graphql";

  setContextClient(urqlClient);
</script>

<Nav />

<slot />
