import type { ImageExt } from "models";
import type { ReactEventHandler } from "react";
import TagChip from "#/components/TagChip";
import { createFileRoute } from "@tanstack/react-router";
import styles from "client-css/m/imagepage.module.scss";
import { Download } from "lucide-react";
import { useMemo } from "react";
import { gql, useQuery } from "urql";

const ImagePage = () => {
  const { id } = Route.useParams();

  const [result] = useQuery<{ image: ImageExt | null }>({
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

  const image = useMemo(() => result.data?.image, [result.data?.image]);
  const fileExt = useMemo(() => image?.filename.split(".").pop(), [image?.filename]);

  const scroll: ReactEventHandler<HTMLImageElement> = (e) => {
    (e.target as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  if (!image) {
    return "missing";
  }

  return (
    <div>
      <img
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
            <h1>
              {image.title || "No title"}
            </h1>

            <span>
              Source:
              {" "}
              <a
                href={image.source ?? undefined}
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
              <Download className={styles.icon} />
              <span>
                {fileExt}
              </span>
            </a>

            {!!fileExt && fileExt !== "avif" && (
              <a className={styles["meta-dlicon"]} href={`/${image.id}/avif`}>
                <Download className={styles.icon} />
                <span>
                  avif
                </span>
              </a>
            )}

            <a className={styles["meta-dlicon"]} href={`/${image.id}/webp`}>
              <Download className={styles.icon} />
              <span>
                webp
              </span>
            </a>
          </div>
        </div>

        <div className={styles.tags}>
          {image.tags?.map((tag) => {
            return (<TagChip key={tag.slug} tag={tag} />);
          })}
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/$id")({ component: ImagePage });
