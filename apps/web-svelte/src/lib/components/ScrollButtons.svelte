<script lang="ts">
  import styles from "client-css/m/scrollbuttons.module.scss";
  import ChevronDown from "lucide-svelte/icons/chevron-down";
  import ChevronUp from "lucide-svelte/icons/chevron-up";

  let showToTop = $state(false);
  let showToBottom = $state(false);

  const onScroll = () => {
    showToTop = window.scrollY > 50;
    showToBottom = window.scrollY + window.innerHeight < globalThis.document.body.scrollHeight - 50;
  };
</script>

<svelte:window on:scroll={onScroll} />

<div class={styles.buttons}>
  <button
    class={showToTop ? undefined : styles.hidden}
    onclick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
  >
    <ChevronUp />
  </button>
  <button
    class={showToBottom ? undefined : styles.hidden}
    onclick={() => {
      window.scrollTo({
        behavior: "smooth",
        top: globalThis.document.body.scrollHeight,
      });
    }}
  >
    <ChevronDown />
  </button>
</div>
