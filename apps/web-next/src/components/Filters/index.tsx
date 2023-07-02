"use client";

import { useSearchParams } from "next/navigation";
import TagQuery from "./TagQuery";
import SortSelect from "./SortSelect";
import TagSearch from "./TagSearch";

const Filters = () => {
  const searchParams = useSearchParams();

  const tags = searchParams.getAll("tag");

  return (
    <div className="mb-2">
      {tags.length > 0 && (
        <div className="inline-flex">
          {tags.map((tag) => (
            <TagQuery key={tag} slug={tag} />
          ))}
        </div>
      )}

      <TagSearch />

      <SortSelect />
    </div>
  );
};

export default Filters;
