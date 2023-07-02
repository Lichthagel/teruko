import { TagExt } from "models";
import NextLink from "next/link";

type TagChipProps = {
  tag: TagExt;
};

const TagChip: React.FC<TagChipProps> = ({ tag }: TagChipProps) => (
  <NextLink
    href={`/?tag=${tag.slug}`}
    className="m-0.5 inline-block select-none whitespace-nowrap rounded bg-gray-500 px-2 py-1 text-white transition hover:brightness-75"
    style={{ backgroundColor: tag.category?.color ?? undefined }}
  >
    {tag.slug}
  </NextLink>
);

export default TagChip;
