import type { TagExt } from "models";
import type { FC } from "react";
import { FiltersContext } from "#/contexts/FiltersContext";
import { useNavigate } from "@tanstack/react-router";
import styles from "client-css/m/imagepage.module.scss";
import { use } from "react";

const TagChip: FC<{ tag: TagExt }> = ({ tag }) => {
  const navigate = useNavigate();

  const filters = use(FiltersContext);

  const onClick = () => {
    filters.tags = [tag.slug];
    navigate({
      to: "/",
    });
  };

  return (
    <button
      className={styles["tag-chip"]}
      onClick={onClick}
      style={{
        backgroundColor: tag.category?.color ?? undefined,
      }}
      type="button"
    >
      {tag.slug}
    </button>
  );
};

export default TagChip;
