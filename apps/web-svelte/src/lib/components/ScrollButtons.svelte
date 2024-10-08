<script lang="ts">
  import styles from "client-css/m/scrollbuttons.module.scss";
  import { ChevronDown, ChevronUp } from "lucide-svelte";

  let showToTop = false;
  let showToBottom = false;

  const onScroll = () => {
    showToTop = window.scrollY > 50;
    showToBottom = window.scrollY + window.innerHeight < globalThis.document.body.scrollHeight - 50;
  };
</script>

<svelte:window on:scroll={onScroll} />

<div class={styles.buttons}>
  <button
    class={showToTop ? undefined : styles.hidden}
    on:click={() => window.scrollTo({ behavior: "smooth", top: 0 })}
  >
    <ChevronUp />
  </button>
  <button
    class={showToBottom ? undefined : styles.hidden}
    on:click={() => {
      window.scrollTo({
        behavior: "smooth",
        top: globalThis.document.body.scrollHeight,
      });
    }}
  >
    <ChevronDown />
  </button>
</div>
