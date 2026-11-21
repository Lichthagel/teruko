import type { ImageSort } from "models";
import type { FunctionComponent } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import styles from "client-css/m/gallery.module.scss";
import { galleryState, initialGalleryLayout, virtualCardStyle, virtualGalleryOptions, watchGallery } from "client-graphql/gallery";
import { useEffect, useRef, useState } from "react";
import { useImages } from "#/hooks/useImages";
import ErrorMessage from "../status/ErrorMessage";
import StatusBar from "../status/StatusBar";
import ImageCard from "./ImageCard";

const Gallery: FunctionComponent<{
  tags: readonly string[];
  sort: ImageSort;
}> = ({ tags, sort }) => {
  const result = useImages(tags, sort);

  const state = useRef(galleryState(tags, sort)).current;
  const galleryRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState(() => initialGalleryLayout(state));
  const virtualizer = useWindowVirtualizer<HTMLDivElement>(virtualGalleryOptions(result.images, state, layout));
  useEffect(() => watchGallery(galleryRef.current!, state, setLayout, () => virtualizer.takeSnapshot(), (index) => {
    virtualizer.scrollToIndex(index, { align: "start" });
    virtualizer.cancelScroll();
  }), [state, virtualizer]);

  const lastIndex = virtualizer.getVirtualItems().at(-1)?.index;
  useEffect(() => {
    if (lastIndex !== undefined && lastIndex >= result.images.length - layout.columns * 3 && !result.fetching) {
      result.fetchMore();
    }
  }, [lastIndex, layout.columns, result]);

  return (
    <>
      {result.images && (
        <>
          <div
            ref={galleryRef}
            className={styles.gallery}
            style={{
              height: virtualizer.getTotalSize(),
            }}
            data-gallery
            data-gallery-count={result.images.length}
          >
            {virtualizer.getVirtualItems().map(item => (
              <div key={item.key} data-index={item.index} ref={virtualizer.measureElement} className={styles["virtual-card"]} style={virtualCardStyle(item, layout)}>
                <ImageCard image={result.images[item.index]!} />
              </div>
            ))}
          </div>
          <div className={styles.sentinel}></div>
        </>
      )}

      {result.error
        && <ErrorMessage error={result.error} title={result.error.name}></ErrorMessage>}

      <StatusBar error={!!result.error} fetching={result.fetching}></StatusBar>
    </>
  );
};

export default Gallery;
