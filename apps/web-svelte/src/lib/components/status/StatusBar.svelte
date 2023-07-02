<script lang="ts">
  export let fetching: boolean;
  export let error: boolean;
</script>

<div
  class="fixed bottom-0 left-0 right-0 z-10 h-1"
  class:bg-error={error}
  class:animate-load={fetching}
  class:bg-primary={fetching}
/>
