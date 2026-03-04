<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import { setContextClient } from "@urql/svelte";
  import { urqlClient } from "client-graphql";
  import "client-css/global.scss";

  type Props = {
    children?: import("svelte").Snippet;
  };

  const { children }: Props = $props();

  setContextClient(urqlClient);
</script>

<Nav />

{@render children?.()}
