"use client";

import { TagExt } from "models";
import { tagsStore } from "client-common/stores";
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
      onClick={onClick}
      className="m-0.5 inline-block select-none whitespace-nowrap rounded bg-gray-500 px-2 py-1 text-white transition hover:brightness-75"
      style={{ backgroundColor: tag.category?.color ?? undefined }}
    >
      {tag.slug}
    </button>
  );
};

export default TagChip;
