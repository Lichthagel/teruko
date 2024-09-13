import { useStore } from "@nanostores/react";
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
        className="m-0.5 flex h-10 select-none items-center whitespace-nowrap rounded bg-gray-500 px-2 text-white"
        style={{
          backgroundColor: data?.tag?.category?.color ?? undefined,
        }}
      >
        <span className="mx-1">{slug}</span>
        <button
          className="mx-1 rounded transition hover:bg-black/20"
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
