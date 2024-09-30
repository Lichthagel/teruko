import { useStore } from "@nanostores/react";
import styles from "client-css/m/filters.module.scss";
import { tagsStore } from "client-stores";
import { X } from "lucide-react";
import { TagExt } from "models";
import { gql, useQuery } from "urql";

import StatusBar from "../StatusBar";

type TagQueryProps = {
  slug: string;
};

const TagQuery = ({ slug }: TagQueryProps) => {
  const tags = useStore(tagsStore);

  const [
    {
      data, fetching, stale, error,
    },
  ] = useQuery<{ tag: TagExt | null }>({
    query: gql`
      query Tag($slug: String!) {
        tag(slug: $slug) {
          category {
            color
          }
        }
      }
    `,
    variables: { slug },
  });

  const removeTag = () => {
    tagsStore.set(tags.filter((tag) => tag !== slug));
  };

  return (
    <>
      <div
        className={styles["tag-query"]}
        style={{
          backgroundColor: data?.tag?.category?.color ?? undefined,
        }}
      >
        <span>{slug}</span>
        <button
          onClick={removeTag}
          type="button"
        >
          <X />
        </button>
      </div>

      <StatusBar busy={fetching || stale} error={!!error} />
    </>
  );
};

export default TagQuery;
