import { TagExt } from "models";

type TagChipProps = {
  tag: TagExt;
};

const TagChip: React.FC<TagChipProps> = ({ tag }: TagChipProps) => (
  <a
    href={`/?tag=${tag.slug}`}
    className="m-0.5 inline-block select-none whitespace-nowrap rounded bg-gray-500 px-2 py-1 text-white transition hover:brightness-75"
    style={{ backgroundColor: tag.category?.color ?? undefined }}
  >
    {tag.slug}
  </a>
);

export default TagChip;
