"use client";

import ErrorMessage from "@/components/ErrorMessage";
import StatusBar from "@/components/StatusBar";
import TagChip from "@/components/TagChip";
import styles from "client-css/m/imagepage.module.scss";
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
        <div>
          <Image
            alt={image.title ?? image.filename}
            className={styles.image}
            height={image.height}
            onLoad={scroll}
            src={`/img/${image.filename}`}
            width={image.width}
          />

          <div className="container">
            <div className={styles["meta-container"]}>
              <div className={styles["meta-title"]}>
                <h1>{image.title}</h1>

                <span>
                  Source:
                  {" "}
                  <a
                    href={image.source || ""}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {image.source}
                  </a>
                </span>
              </div>

              <div className={styles["meta-rest"]}>
                <div className={styles["meta-dates"]}>
                  <div>
                    <span>Created At: </span>
                    {image.createdAt.toLocaleString()}
                  </div>
                  <div>
                    <span>Updated At: </span>
                    {image.updatedAt.toLocaleString()}
                  </div>
                </div>

                <a className={styles["meta-dlicon"]} href={`/${image.id}/original`}>
                  <DownloadIcon className={styles.icon} />
                  <span>
                    {fileExt}
                  </span>
                </a>

                {!!fileExt && fileExt === "webp" && (
                  <a className={styles["meta-dlicon"]} href={`/${image.id}/avif`}>
                    <DownloadIcon className={styles.icon} />
                    <span>
                      avif
                    </span>
                  </a>
                )}

                <a className={styles["meta-dlicon"]} href={`/${image.id}/webp`}>
                  <DownloadIcon className={styles.icon} />
                  <span>
                    webp
                  </span>
                </a>
              </div>
            </div>

            <div className={styles.tags}>
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
