"use client";

import type { ImageExt } from "models";

import { tagsStore } from "client-common/stores";
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
    <div className="mb-1 bg-zinc-300 shadow-xl duration-500 animate-in fade-in slide-in-from-bottom dark:bg-gray-700">
      <NextLink href={`/${image.id}`}>
        <div className="relative">
          <NextImage
            alt={image.title ?? image.filename}
            height={image.height}
            src={`/img/${image.filename}`}
            width={image.width}
          />

          {image.title && (
            <div className="text-shadow-xl absolute bottom-0 left-0 right-0 z-10 overflow-hidden whitespace-nowrap bg-gradient-to-b from-transparent to-black/80 px-1 text-sm text-white">
              {image.title}
            </div>
          )}
        </div>
      </NextLink>
      <div className="snap flex snap-x flex-row flex-nowrap overflow-x-scroll scrollbar-none">
        {(image.tags || [])
          .filter((tag) => !tag.slug.startsWith("artist_"))
          .map((tag) => (
            <button
              className="m-0.5 inline-block select-none whitespace-nowrap rounded bg-gray-500 px-1 text-sm text-white transition hover:brightness-75"
              // eslint-disable-next-line @eslint-react/no-duplicate-key
              key={tag.slug}
              onClick={() => onClick(tag.slug)}
              style={{ backgroundColor: tag.category?.color ?? "gray" }}
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
