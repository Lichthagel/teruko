<script lang="ts">
  import { Icon as IconType } from "@lucide/svelte";
  import styles from "client-css/m/select.module.scss";

  let { icon, options, value = $bindable() }: {
    icon?: typeof IconType;
    options: (string | { value: string; label: string })[];
    value?: string;
  } = $props();

</script>

<div class={styles.select}>
  {#if icon}
    {@const Icon = icon}
    <Icon class={styles.icon} />
  {/if}

  <select bind:value={value}>
    {#each options as option (typeof option === "string" ? option : option.value)}
      <option value={typeof option === "string" ? option : option.value}>{typeof option === "string" ? option : option.label}</option>
    {/each}
  </select>
</div>
