"use client";

import ImageCard from "./ImageCard";
import { type ReactElement, useRef, useCallback, Fragment } from "react";
import LoadBar from "./LoadBar";
import ErrorBar from "./ErrorBar";
import useImages from "@/hooks/useImages";
import { ImageSort } from "models";

type GalleryProps = {
  tags: string[];
  sort: ImageSort;
};

const Gallery: React.FC<GalleryProps> = ({
  tags,
  sort,
}: GalleryProps): ReactElement => {
  const { fetching, stale, error, images, fetchMore } = useImages(tags, sort);

  const observer = useRef<IntersectionObserver>();

  const endRef = useCallback(
    (node: HTMLDivElement) => {
      if (fetching) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchMore, fetching]
  );

  if (error)
    return (
      <>
        <ErrorBar />
        Error: {error.message}
      </>
    );

  return (
    <>
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

      {(fetching || stale) && <LoadBar />}
    </>
  );
};

export default Gallery;
