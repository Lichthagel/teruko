import type { ImageExt } from "models";
import type { FunctionComponent } from "react";
import { Link } from "@tanstack/react-router";
import styles from "client-css/m/gallery.module.scss";
import { useFilters } from "#/stores/filters";

const ImageCard: FunctionComponent<{ image: ImageExt }> = ({ image }) => {
  const { setTags } = useFilters();

  const onTagClick = (slug: string) => {
    setTags([slug]);
  };

  return (
    <div className={styles.card}>
      <Link to="/$id" params={{ id: image.id.toString() }}>
        <div className={styles["image-container"]}>
          <img
            alt={image.title ?? image.filename}
            height={image.height}
            src={`/img/${image.filename}`}
            width={image.width}
          />

          {!!image.title
            && (
              <div>
                {image.title}
              </div>
            )}
        </div>
      </Link>
      <div className={styles["tag-list"]}>
        {(image.tags ?? []).filter(tag => !tag.slug.startsWith("artist_")).map(tag => (
          <button
            key={tag.slug}
            onClick={() => onTagClick(tag.slug)}
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
