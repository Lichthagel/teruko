<script lang="ts">
  import { page } from "$app/state";
</script>

<div class="container mx-auto py-9 text-center">
  <div class="mx-auto text-6xl">
    {page.status}
  </div>

  <div class="mx-auto text-xl">
    {#if page.error}
      {page.error.message}
    {:else}
      Unknown error
    {/if}
  </div>
</div>
