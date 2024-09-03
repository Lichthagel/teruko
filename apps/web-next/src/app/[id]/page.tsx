"use client";

import ErrorMessage from "@/components/ErrorMessage";
import StatusBar from "@/components/StatusBar";
import TagChip from "@/components/TagChip";
import { DownloadIcon } from "lucide-react";
import { ImageExt } from "models";
import Image from "next/image";
import { ReactElement, ReactEventHandler, useMemo } from "react";
import { gql, useQuery } from "urql";

const scroll: ReactEventHandler<HTMLImageElement> = (e) => {
  e.currentTarget.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

const ImagePage = ({ params }: { params: { id: string } }): ReactElement => {
  const { id } = params;

  const [result] = useQuery<{ image?: ImageExt }>({
    query: gql`
      query Image($id: ID!) {
        image(id: $id) {
          id
          title
          source
          filename
          createdAt
          updatedAt
          width
          height
          tags {
            slug
            category {
              color
            }
          }
        }
      }
    `,
    variables: { id },
  });

  const {
    data, fetching, stale, error,
  } = result;

  const image = useMemo(() => data?.image, [data]);
  const fileExt = useMemo(() => image?.filename.split(".").pop(), [image]);

  return (
    <>
      {image && (
        <div className="space-y-1">
          <Image
            alt={image.title ?? image.filename}
            className="mx-auto max-h-screen object-contain"
            height={image.height}
            onLoad={scroll}
            src={`/img/${image.filename}`}
            width={image.width}
          />

          <div className="container mx-auto pb-12">
            <div className="my-4 w-full p-1 lg:flex">
              <div className="overflow-hidden lg:flex-grow">
                <h1 className="text-3xl">{image.title}</h1>

                <span className="text-sm">
                  Source:
                  <a
                    className="link"
                    href={image.source || ""}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {image.source}
                  </a>
                </span>
              </div>

              <div className="flex items-center lg:flex-shrink-0">
                <div className="my-1 flex-grow text-xs lg:mx-2 lg:text-right lg:text-sm">
                  <div>
                    <span className="font-light">Created At: </span>
                    {image.createdAt.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-light">Updated At: </span>
                    {image.updatedAt.toLocaleString()}
                  </div>
                </div>

                <a className="relative pb-2" href={`/${image.id}/original`}>
                  <DownloadIcon className="mx-1 h-10 w-10" />
                  <span className="absolute bottom-0 left-0 right-0 mx-auto px-1 text-center text-[0.5rem] uppercase">
                    {fileExt}
                  </span>
                </a>

                {!!fileExt && fileExt === "webp" && (
                  <a className="relative pb-2" href={`/${image.id}/avif`}>
                    <DownloadIcon className="mx-1 h-10 w-10" />
                    <span className="absolute bottom-0 left-0 right-0 mx-auto px-1 text-center text-[0.5rem] uppercase">
                      avif
                    </span>
                  </a>
                )}

                <a className="relative pb-2" href={`/${image.id}/webp`}>
                  <DownloadIcon className="mx-1 h-10 w-10" />
                  <span className="absolute bottom-0 left-0 right-0 mx-auto px-1 text-center text-[0.5rem] uppercase">
                    webp
                  </span>
                </a>
              </div>
            </div>

            <div className="w-full text-center lg:text-start">
              {(image.tags || []).map((tag) => (
                <TagChip key={tag.slug} tag={tag} />
              ))}
            </div>
          </div>
        </div>
      )}

      {error && <ErrorMessage error={error} title={error.name} />}

      {!fetching && !error && !image && <ErrorMessage title="Not Found" />}

      <StatusBar busy={fetching || stale} error={!!error} />
    </>
  );
};

export default ImagePage;
