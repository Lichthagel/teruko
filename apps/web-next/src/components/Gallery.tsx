"use client";

import styles from "client-css/m/gallery.module.scss";
import { ImageSort } from "models";
import {
  type ReactElement, useCallback, useRef,
} from "react";

import useImages from "@/hooks/useImages";

import ErrorMessage from "./ErrorMessage";
import ImageCard from "./ImageCard";
import StatusBar from "./StatusBar";

type GalleryProps = {
  tags: string[];
  sort: ImageSort;
};

const Gallery: React.FC<GalleryProps> = ({
  tags,
  sort,
}: GalleryProps): ReactElement => {
  const {
    fetching, stale, error, images, fetchMore,
  } = useImages(tags, sort);

  const observer = useRef<IntersectionObserver>(null);

  const endRef = useCallback(
    (node: HTMLDivElement) => {
      if (fetching) {
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        const entry = entries[0];

        if (entry && entry.isIntersecting) {
          fetchMore();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [fetchMore, fetching],
  );

  return (
    <>
      {images.length > 0 && (
        <div className={styles.gallery}>
          {images.map((image, index) => (
            <div
              key={image.id}
              ref={index === images.length - 1 ? endRef : undefined}
            >
              <ImageCard image={image} />
            </div>
          ))}
        </div>
      )}

      {error && <ErrorMessage error={error} title={error.name} />}

      <StatusBar busy={fetching || stale} error={!!error} />
    </>
  );
};

export default Gallery;
