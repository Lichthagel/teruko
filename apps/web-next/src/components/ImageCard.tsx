"use client";

import type { ImageExt } from "models";

import styles from "client-css/m/gallery.module.scss";
import { tagsStore } from "client-stores";
import NextImage from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

type ImageCardProps = {
  image: ImageExt;
};

const ImageCard: React.FC<ImageCardProps> = ({ image }: ImageCardProps) => {
  const router = useRouter();

  const onClick = useCallback(
    (tagSlug: string) => {
      tagsStore.set([tagSlug]);
      router.push("/");
    },
    [router],
  );

  return (
    <div className={styles.card}>
      <NextLink href={`/${image.id}`}>
        <div className={styles["image-container"]}>
          <NextImage
            alt={image.title ?? image.filename}
            height={image.height}
            src={`/img/${image.filename}`}
            width={image.width}
          />

          {image.title && (
            <div>
              {image.title}
            </div>
          )}
        </div>
      </NextLink>
      <div className={styles["tag-list"]}>
        {(image.tags || [])
          .filter((tag) => !tag.slug.startsWith("artist_"))
          .map((tag) => (
            <button
              key={tag.slug}
              onClick={() => onClick(tag.slug)}
              style={{ backgroundColor: tag.category?.color ?? undefined }}
              type="button"
            >
              {tag.slug}
            </button>
          ))}
      </div>
    </div>
  );
};

export default ImageCard;
