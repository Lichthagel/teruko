"use client";

import TagQuery from "./TagQuery";
import SortSelect from "./SortSelect";
import TagSearch from "./TagSearch";
import { tagsStore } from "client-common/stores";
import { useStore } from "@nanostores/react";

const Filters = () => {
  const tags = useStore(tagsStore);

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
