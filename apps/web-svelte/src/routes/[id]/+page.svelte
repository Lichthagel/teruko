<script lang="ts">
  import type { ImageExt } from "models";
  import type { EventHandler } from "svelte/elements";

  import { page } from "$app/stores";
  import ErrorMessage from "$lib/components/status/ErrorMessage.svelte";
  import StatusBar from "$lib/components/status/StatusBar.svelte";
  import TagChip from "$lib/components/TagChip.svelte";
  import { getContextClient, gql, queryStore } from "@urql/svelte";
  import styles from "client-css/m/imagepage.module.scss";
  import { DownloadIcon } from "lucide-svelte";

  const { id } = $page.params;

  const result = queryStore<{ image: ImageExt | null }>({
    client: getContextClient(),
    query: gql`
      query Image($id: ID!) {
        image(id: $id) {
          id
          title
          source
          filename
          createdAt
          updatedAt
          width
          height
          tags {
            slug
            category {
              color
            }
          }
        }
      }
    `,
    variables: { id },
  });

  $: image = $result.data?.image;
  $: fileExt = image?.filename.split(".").pop();

  const scroll: EventHandler = (e) => {
    (e.target as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };
</script>

<svelte:head>
  <title>{image && image.title ? `${image.title} - ` : ""}てる子</title>
</svelte:head>

{#if image}
  <div>
    <img
      alt={image.title ?? image.filename}
      class={styles.image}
      height={image.height}
      on:load={scroll}
      src={`/img/${image.filename}`}
      width={image.width}
    />

    <div class="container">
      <div class={styles["meta-container"]}>
        <div class={styles["meta-title"]}>
          <h1>
            {image.title || "No title"}
          </h1>

          <span>
            Source:
            <a
              href={image.source}
              rel="noopener noreferrer"
              target="_blank"
            >
              {image.source}
            </a>
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

          <a class={styles["meta-dlicon"]} href={`/${image.id}/original`}>
            <DownloadIcon class={styles.icon} />
            <span>
              {fileExt}
            </span>
          </a>

          {#if !!fileExt && fileExt !== "avif"}
            <a class={styles["meta-dlicon"]} href={`/${image.id}/avif`}>
              <DownloadIcon class={styles.icon} />
              <span>
                avif
              </span>
            </a>
          {/if}

          <a class={styles["meta-dlicon"]} href={`/${image.id}/webp`}>
            <DownloadIcon class={styles.icon} />
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
