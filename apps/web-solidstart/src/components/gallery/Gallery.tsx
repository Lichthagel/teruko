import type { ImageSort } from "models";
import type { Component } from "solid-js";
import styles from "client-css/m/gallery.module.scss";
import { For, onCleanup, onMount, Show } from "solid-js";
import { useImages } from "../hooks/useImages";
import ErrorMessage from "../status/ErrorMessage";
import { StatusBar } from "../status/StatusBar";
import { ImageCard } from "./ImageCard";

const Gallery: Component<{
  tags: readonly string[];
  sort: ImageSort;
}> = (props) => {
  const { images, fetching, error, fetchMore } = useImages(() => props.tags, () => props.sort);

  let endDiv: HTMLDivElement | undefined;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0] && entries[0].isIntersecting) {
      fetchMore();
    }
  });

  onMount(() => {
    observer.observe(endDiv!);
  });

  onCleanup(() => {
    observer.disconnect();
  });

  return (
    <>

      <div class={styles.gallery}>
        <For each={images()}>
          {image => (
            <ImageCard image={image} />
          )}
        </For>

        <div ref={endDiv} />
      </div>

      <Show when={error()}>
        <ErrorMessage error={error()} title={error()?.name} />
      </Show>

      <StatusBar error={!!error()} fetching={fetching()} />
    </>
  );
};

export default Gallery;
