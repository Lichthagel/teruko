"use client";

import useImages from "@/hooks/useImages";
import { ImageSort } from "models";
import {
  type ReactElement, useCallback, useRef,
} from "react";

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

  const observer = useRef<IntersectionObserver>();

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
        <div className="grid grid-cols-1 grid-rows-masonry gap-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5">
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
