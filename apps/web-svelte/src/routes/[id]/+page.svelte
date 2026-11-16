<script lang="ts">
  import type { EventHandler } from "svelte/elements";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { Download } from "@lucide/svelte";
  import { getContextClient, queryStore } from "@urql/svelte";
  import styles from "client-css/m/imagepage.module.scss";
  import { createImageNavigation } from "client-graphql/gallery";
  import { Image } from "client-graphql/snippets";
  import { onMount } from "svelte";
  import ErrorMessage from "#lib/components/status/ErrorMessage.svelte";
  import StatusBar from "#lib/components/status/StatusBar.svelte";
  import TagChip from "#lib/components/TagChip.svelte";

  const client = getContextClient();
  const navigation = createImageNavigation(client, () => Number(page.params.id), id => goto(resolve("/[id]", {
    id: String(id),
  })));
  let progress = $state(navigation.getSnapshot());
  const navigationState = $derived(navigation.getState(progress));
  onMount(() => {
    const unsubscribe = navigation.subscribe(() => {
      progress = navigation.getSnapshot();
    });
    return () => {
      unsubscribe();
      navigation.dispose();
    };
  });

  const result = $derived(queryStore({
    client,
    query: Image,
    variables: {
      id: Number.parseInt(page.params.id!),
    },
    pause: !page.params.id,
  }));

  const image = $derived($result.data?.image);
  const fileExt = $derived(image?.filename.split(".").pop());

  const scroll: EventHandler = (e) => {
    (e.target as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };
</script>

<svelte:head>
  <title>{image && image.title
    ? `${image.title} - `
    : ""}てる子</title>
</svelte:head>

<svelte:window onkeydown={navigation.keydown} />

<div class={styles.viewer} data-image-id={image?.id} aria-busy={navigationState.loading}>
  <button type="button" aria-label="Previous image" data-direction="previous" disabled={!navigationState.canPrevious} onclick={() => void navigation.previous()}>&lt;</button>
  <button type="button" aria-label="Next image" data-direction="next" disabled={!navigationState.canNext} onclick={() => void navigation.next()}>
    {#if image}
      <img
        alt={image.title ?? image.filename}
        class={styles.image}
        height={image.height}
        onload={scroll}
        src={`/img/${image.filename}`}
        width={image.width}
      />
    {/if}
  </button>
  <button type="button" aria-label="Next image" data-direction="next" disabled={!navigationState.canNext} onclick={() => void navigation.next()}>&gt;</button>
  <span role="status">{navigationState.error}</span>
</div>

{#if image}
  <div>

    <div class="container">
      <div class={styles["meta-container"]}>
        <div class={styles["meta-title"]}>
          <h1>
            {image.title || "No title"}
          </h1>

          <span>
            Source:
            <!-- eslint-disable svelte/no-navigation-without-resolve -->
            <a
              href={image.source}
              rel="noopener noreferrer"
              target="_blank"
            >
              {image.source}
            </a>
            <!-- eslint-enable svelte/no-navigation-without-resolve -->
          </span>
        </div>

        <div class={styles["meta-rest"]}>
          <div class={styles["meta-dates"]}>
            <div>
              <span>Created At: </span>
              {image.createdAt.toLocaleString()}
            </div>
            <div>
              <span>Updated At: </span>
              {image.updatedAt.toLocaleString()}
            </div>
          </div>

          <a class={styles["meta-dlicon"]} href={resolve("/[id]/original", { id: `${image.id}` })}>
            <Download class={styles.icon} />
            <span>
              {fileExt}
            </span>
          </a>

          {#if !!fileExt && fileExt !== "avif"}
            <a class={styles["meta-dlicon"]} href={resolve("/[id]/avif", { id: `${image.id}` })}>
              <Download class={styles.icon} />
              <span>
                avif
              </span>
            </a>
          {/if}

          <a class={styles["meta-dlicon"]} href={resolve("/[id]/webp", { id: `${image.id}` })}>
            <Download class={styles.icon} />
            <span>
              webp
            </span>
          </a>
        </div>
      </div>

      <div class={styles.tags}>
        {#each image.tags || [] as tag (tag.slug)}
          <TagChip {tag} />
        {/each}
      </div>
    </div>
  </div>
{/if}

{#if $result.error}
  <ErrorMessage error={$result.error} title={$result.error.name} />
{/if}

{#if !$result.fetching && !$result.error && !$result.data?.image}
  <ErrorMessage title="Not Found" />
{/if}

<StatusBar error={!!$result.error} fetching={$result.fetching} />
