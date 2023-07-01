<script lang="ts">
  import { ChevronDown, ChevronUp } from "lucide-svelte";

  let showToTop = false;
  let showToBottom = false;

  const onScroll = () => {
    showToTop = window.scrollY > 50;
    showToBottom =
      window.scrollY + window.innerHeight <
      window.document.body.scrollHeight - 50;
  };
</script>

<svelte:window on:scroll={onScroll} />

<div class="join fixed bottom-3 right-3 z-10 bg-base-100">
  <button
    class="btn-ghost btn-square btn"
    class:hidden={!showToTop}
    on:click={() => window.scrollTo({ behavior: "smooth", top: 0 })}
  >
    <ChevronUp />
  </button>
  <button
    class="btn-ghost btn-square btn"
    class:hidden={!showToBottom}
    on:click={() => {
      window.scrollTo({
        behavior: "smooth",
        top: window.document.body.scrollHeight,
      });
    }}
  >
    <ChevronDown />
  </button>
</div>
