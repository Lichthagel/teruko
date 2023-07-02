import { X } from "lucide-react";
import { TagExt } from "models";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { gql, useQuery } from "urql";

type TagQueryProps = {
  slug: string;
};

const TagQuery = ({ slug }: TagQueryProps) => {
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [{ data, fetching, stale, error }] = useQuery<{ tag: TagExt | null }>({
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
    const newSearchParams = new URLSearchParams(searchParams.toString());

    newSearchParams.delete("tag");
    for (const tag of searchParams.getAll("tag")) {
      if (tag !== slug) {
        newSearchParams.append("tag", tag);
      }
    }

    console.log(newSearchParams.toString());

    router.push(`${pathname}?${newSearchParams.toString()}`);
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
        >
          <X />
        </button>
      </div>

      {/* TODO status bar */}
    </>
  );
};

export default TagQuery;
