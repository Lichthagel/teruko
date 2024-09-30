"use client";

import { useStore } from "@nanostores/react";
import styles from "client-css/m/filters.module.scss";
import { tagsStore } from "client-stores";

import SortSelect from "./SortSelect";
import TagQuery from "./TagQuery";
import TagSearch from "./TagSearch";

const Filters = () => {
  const tags = useStore(tagsStore);

  return (
    <div className={styles.main}>
      {tags.length > 0 && (
        <div className={styles["tag-container"]}>
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
