import type { FC } from "react";
import { useFilters } from "#/stores/filters";
import styles from "client-css/m/filters.module.scss";
import { Tag } from "client-graphql/snippets";
import { X } from "lucide-react";
import { useCallback } from "react";
import { useQuery } from "urql";
import StatusBar from "../status/StatusBar";

export const TagQuery: FC<{ tag: string }> = ({ tag }) => {
  const { setTags } = useFilters();

  const [result] = useQuery({
    query: Tag,
    variables: { slug: tag },
  });

  const removeTag = useCallback(() => {
    setTags(prev => prev.filter(t => t !== tag));
  }, [setTags, tag]);

  return (
    <>
      <div
        className={styles["tag-query"]}
        style={{ backgroundColor: result.data?.tag.category?.color ?? undefined }}
      >
        <span>{tag}</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            removeTag();
          }}
          type="button"
        >
          <X />
        </button>
      </div>

      <StatusBar error={!!result.error} fetching={result.fetching} />
    </>
  );
};
