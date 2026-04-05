import type { MouseEventHandler } from "react";
import { useFilters } from "#/stores/filters";
import styles from "client-css/m/filters.module.scss";
import { ListX } from "lucide-react";
import { useCallback } from "react";
import { SortSelect } from "./SortSelect";
import { TagQuery } from "./TagQuery";
import { TagSearch } from "./TagSearch";

export const Filters = () => {
  const { tags, setTags } = useFilters();

  const resetTags: MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    setTags([]);
  }, [setTags]);

  return (
    <div className={styles.main}>
      {tags.length > 0 && (
        <div className={styles["tag-container"]}>
          {tags.map(tag => (<TagQuery key={tag} tag={tag} />))}
          <div className={`${styles["tag-query"]} ${styles.reset}`}>
            <button onClick={resetTags}>
              <ListX />
            </button>
          </div>
        </div>
      )}

      <TagSearch />
      <SortSelect />
    </div>
  );
};
