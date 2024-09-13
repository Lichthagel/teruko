"use client";

import { useStore } from "@nanostores/react";
import { tagsStore } from "client-stores";

import SortSelect from "./SortSelect";
import TagQuery from "./TagQuery";
import TagSearch from "./TagSearch";

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
