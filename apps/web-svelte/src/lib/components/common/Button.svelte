<script lang="ts">
  import type { Icon as IconType } from "@lucide/svelte";
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import styles from "client-css/m/button.module.scss";

  const { children, icon, class: className, ...restProps }: { children?: Snippet; icon?: typeof IconType } & HTMLButtonAttributes = $props();
</script>

<button class={[styles.button, className]} type="button" {...restProps}>
  {#if icon}
    {@const Icon = icon}
    <Icon />
  {/if}

  {@render children?.()}
</button>
