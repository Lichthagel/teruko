<script lang="ts">
  import { page } from "$app/stores";
  import StatusBar from "$lib/components/StatusBar.svelte";
  import TagChip from "$lib/components/TagChip.svelte";
  import type { ImageExt } from "models";
  import { getContextClient, queryStore, gql } from "@urql/svelte";
  import { DownloadIcon } from "lucide-svelte";
  import type { EventHandler } from "svelte/elements";

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
  <div class="space-y-1">
    <img
      src={`/img/${image.filename}`}
      alt={image.title ?? image.filename}
      width={image.width}
      height={image.height}
      class="mx-auto max-h-screen object-contain"
      on:load={scroll}
    />

    <div class="container mx-auto pb-12">
      <div class="my-4 w-full p-1 lg:flex">
        <div class="overflow-hidden lg:flex-grow">
          <h1 class="text-3xl" class:text-neutral-content={!image.title}>
            {image.title || "No title"}
          </h1>

          <span class="text-sm">
            Source:
            <a
              href={image.source}
              target="_blank"
              rel="noopener noreferrer"
              class="link"
            >
              {image.source}
            </a>
          </span>
        </div>

        <div class="flex items-center lg:flex-shrink-0">
          <div class="my-1 flex-grow text-xs lg:mx-2 lg:text-right lg:text-sm">
            <div>
              <span class="font-light">Created At: </span>
              {image.createdAt.toLocaleString()}
            </div>
            <div>
              <span class="font-light">Updated At: </span>
              {image.updatedAt.toLocaleString()}
            </div>
          </div>

          <a class="relative pb-2" href={`/${image.id}/original`}>
            <DownloadIcon class="mx-1 h-10 w-10" />
            <span
              class="absolute bottom-0 left-0 right-0 mx-auto px-1 text-center text-[0.5rem] uppercase"
            >
              {fileExt}
            </span>
          </a>

          {#if !!fileExt && fileExt !== "avif"}
            <a class="relative pb-2" href={`/${image.id}/avif`}>
              <DownloadIcon class="mx-1 h-10 w-10" />
              <span
                class="absolute bottom-0 left-0 right-0 mx-auto px-1 text-center text-[0.5rem] uppercase"
              >
                avif
              </span>
            </a>
          {/if}

          <a class="relative pb-2" href={`/${image.id}/webp`}>
            <DownloadIcon class="mx-1 h-10 w-10" />
            <span
              class="absolute bottom-0 left-0 right-0 mx-auto px-1 text-center text-[0.5rem] uppercase"
            >
              webp
            </span>
          </a>
        </div>
      </div>

      <div class="w-full text-center lg:text-start">
        {#each image.tags || [] as tag (tag.slug)}
          <TagChip {tag} />
        {/each}
      </div>
    </div>
  </div>
{/if}

<StatusBar fetching={$result.fetching} error={!!$result.error} />
