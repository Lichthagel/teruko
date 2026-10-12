import type { ImageExt } from "models";
import type { Component } from "solid-js";
import { A } from "@solidjs/router";
import styles from "client-css/m/gallery.module.scss";
import { For, Show } from "solid-js";
import { setTags } from "~/utils/filters";

export const ImageCard: Component<{ image: ImageExt }> = (props) => {
  const onTagClick = (slug: string) => {
    setTags([slug]);
  };

  return (
    <div class={styles.card}>
      <A href={`/${props.image.id}`}>
        <div class={styles["image-container"]}>
          <img
            alt={props.image.title ?? props.image.filename}
            height={props.image.height}
            src={`/img/${props.image.filename}`}
            width={props.image.width}
          />

          <Show when={!!props.image.title}>
            <div>{props.image.title}</div>
          </Show>
        </div>
      </A>
      <div class={styles["tag-list"]}>
        <For each={(props.image.tags ?? []).filter(tag => !tag.slug.startsWith("artist_"))}>
          {tag => (
            <button
              onClick={() => onTagClick(tag.slug)}
              style:background-color={tag.category?.color ?? "gray"}
              type="button"
            >
              {tag.slug}
            </button>
          )}
        </For>
      </div>
    </div>

  );
};
