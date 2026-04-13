import type { Tag, TagCategory } from "models";
import type { FC, MouseEventHandler } from "react";
import { useFilters } from "#/stores/filters";
import { useNavigate } from "@tanstack/react-router";
import styles from "client-css/m/imagepage.module.scss";
import { BadgeCheck } from "lucide-react";
import { useCallback } from "react";

const TagChip: FC<{
  tag: Pick<Tag, "slug" | "approved"> & { category?: Pick<TagCategory, "color"> | null };
}> = ({ tag }) => {
  const navigate = useNavigate();

  const { setTags } = useFilters();

  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    setTags([tag.slug]);
    navigate({
      to: "/",
    });
  }, [navigate, setTags, tag.slug]);

  return (
    <button
      className={styles["tag-chip"]}
      onClick={onClick}
      style={{
        backgroundColor: tag.category?.color ?? undefined,
      }}
      type="button"
    >
      <span>{tag.slug}</span>
      {tag.approved && <BadgeCheck size={16} />}
    </button>
  );
};

export default TagChip;
