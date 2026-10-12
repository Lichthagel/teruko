import type { FC } from "react";
import styles from "client-css/m/filters.module.scss";
import { Tag } from "client-graphql/snippets";
import { BadgeCheck, Pencil, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useQuery } from "urql";
import { useFilters } from "#/stores/filters";
import StatusBar from "../status/StatusBar";
import TagDialog from "../tag/TagDialog";

export const TagQuery: FC<{ tag: string }> = ({ tag }) => {
  const { setTags } = useFilters();

  const [dialogOpen, setDialogOpen] = useState(false);

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
        {result.data?.tag.approved && <BadgeCheck size={16} />}
        <button
          onClick={(e) => {
            e.preventDefault();
            setDialogOpen(true);
          }}
          type="button"
        >
          <Pencil />
        </button>
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

      <TagDialog open={dialogOpen} setOpen={setDialogOpen} slug={tag} />

      <StatusBar error={!!result.error} fetching={result.fetching} />
    </>
  );
};
