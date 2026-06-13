import type { ImageSort } from "models";
import type { FunctionComponent } from "react";
import styles from "client-css/m/gallery.module.scss";
import { useEffect, useRef } from "react";
import { useImages } from "#/hooks/useImages";
import ErrorMessage from "../status/ErrorMessage";
import StatusBar from "../status/StatusBar";
import ImageCard from "./ImageCard";

const Gallery: FunctionComponent<{
  tags: readonly string[];
  sort: ImageSort;
}> = ({ tags, sort }) => {
  const result = useImages(tags, sort);

  const endDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting) {
        result.fetchMore();
      }
    });

    if (endDivRef.current) {
      observer.observe(endDivRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [result]);

  return (
    <>
      {result.images && (
        <div className={styles.gallery}>
          {result.images.map(image => (
            <ImageCard key={image.id} image={image} />
          ))}
          <div ref={endDivRef}></div>
        </div>
      )}

      {result.error
        && <ErrorMessage error={result.error} title={result.error.name}></ErrorMessage>}

      <StatusBar error={!!result.error} fetching={result.fetching}></StatusBar>
    </>
  );
};

export default Gallery;
