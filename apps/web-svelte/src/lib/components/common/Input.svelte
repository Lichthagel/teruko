<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import styles from "client-css/m/input.module.scss";

  let { value = $bindable(""), ...restProps }: HTMLInputAttributes = $props();

</script>

<div class={styles.container}>
  <input type="text" bind:value={value} {...restProps} />
</div>
