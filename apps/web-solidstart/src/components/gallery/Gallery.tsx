import type { ImageSort } from "models";
import type { Component } from "solid-js";
import { createWindowVirtualizer } from "@tanstack/solid-virtual";
import styles from "client-css/m/gallery.module.scss";
import { galleryState, initialGalleryLayout, virtualCardStyle, virtualGalleryOptions, watchGallery } from "client-graphql/gallery";
import { createEffect, createSignal, For, onCleanup, onMount, Show, untrack } from "solid-js";
import { useImages } from "../../hooks/useImages";
import ErrorMessage from "../status/ErrorMessage";
import { StatusBar } from "../status/StatusBar";
import { ImageCard } from "./ImageCard";

const Gallery: Component<{
  tags: readonly string[];
  sort: ImageSort;
}> = (props) => {
  const { images, fetching, error, fetchMore } = useImages(() => props.tags, () => props.sort);

  const state = untrack(() => galleryState(props.tags, props.sort));
  const [layout, setLayout] = createSignal(initialGalleryLayout(state));
  let gallery: HTMLDivElement | undefined;
  const virtualizer = createWindowVirtualizer<HTMLDivElement>({
    get count() { return images().length; },
    get enabled() { return layout().width > 0; },
    get lanes() { return layout().columns; },
    get scrollMargin() { return layout().margin; },
    get gap() { return layout().gap; },
    initialOffset: state.offset,
    initialMeasurementsCache: state.measurements,
    overscan: 3,
    getItemKey: index => images()[index]!.id,
    estimateSize: index => virtualGalleryOptions(images(), state, layout()).estimateSize(index),
  });
  onMount(() => {
    const dispose = watchGallery(gallery!, state, setLayout, () => virtualizer.takeSnapshot(), (index) => {
      virtualizer.scrollToIndex(index, { align: "start" });
      virtualizer.cancelScroll();
    });
    onCleanup(dispose);
  });

  createEffect(() => {
    const last = virtualizer.getVirtualItems().at(-1);
    if (last && last.index >= images().length - layout().columns * 3 && !fetching()) {
      untrack(fetchMore);
    }
  });

  return (
    <>

      <div ref={gallery} class={styles.gallery} style={{ height: `${virtualizer.getTotalSize()}px` }} data-gallery data-gallery-count={images().length}>
        <For each={virtualizer.getVirtualItems()}>
          {item => (
            <div data-index={item.index} ref={element => virtualizer.measureElement(element)} class={styles["virtual-card"]} style={virtualCardStyle(item, layout())}>
              <ImageCard image={images()[item.index]!} />
            </div>
          )}
        </For>
      </div>

      <div class={styles.sentinel} />

      <Show when={error()}>
        <ErrorMessage error={error()} title={error()?.name} />
      </Show>

      <StatusBar error={!!error()} fetching={fetching()} />
    </>
  );
};

export default Gallery;
