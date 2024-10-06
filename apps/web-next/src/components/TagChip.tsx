"use client";

import styles from "client-css/m/imagepage.module.scss";
import { tagsStore } from "client-stores";
import { TagExt } from "models";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

type TagChipProps = {
  tag: TagExt;
};

const TagChip: React.FC<TagChipProps> = ({ tag }: TagChipProps) => {
  const router = useRouter();

  const onClick = useCallback(() => {
    tagsStore.set([tag.slug]);
    router.push("/");
  }, [router, tag.slug]);

  return (
    <button
      className={styles["tag-chip"]}
      onClick={onClick}
      style={{ backgroundColor: tag.category?.color ?? undefined }}
      type="button"
    >
      {tag.slug}
    </button>
  );
};

export default TagChip;
