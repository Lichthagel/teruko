<script lang="ts">
  import { Icon as IconType } from "@lucide/svelte";
  import styles from "client-css/m/select.module.scss";

  let { icon, options, value = $bindable(), setValue }: {
    icon?: typeof IconType;
    options: (string | { value: string; label: string })[];
    value?: string;
    setValue?: (value?: string) => void;
  } = $props();

</script>

<div class={styles.select}>
  {#if icon}
    {@const Icon = icon}
    <Icon class={styles.icon} />
  {/if}

  <select
    oninput={(event) => {
      if (setValue) {
        event.preventDefault();
        setValue(event.currentTarget.value);
      }
    }}
    value={value}
  >
    {#each options as option (typeof option === "string" ? option : option.value)}
      <option value={typeof option === "string" ? option : option.value}>{typeof option === "string" ? option : option.label}</option>
    {/each}
  </select>
</div>
