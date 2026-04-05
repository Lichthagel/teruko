import type { InputEventHandler } from "react";
import { useFilters } from "#/stores/filters";
import styles from "client-css/m/filters.module.scss";
import { ArrowDownNarrowWide } from "lucide-react";
import { zImageSort } from "models";
import { useCallback } from "react";

export const SortSelect = () => {
  const { sort, setSort } = useFilters();

  const handleInput: InputEventHandler<HTMLSelectElement> = useCallback((event) => {
    event.preventDefault();

    setSort(zImageSort.parse(event.currentTarget.value));
  }, [setSort]);

  return (
    <div className={styles.sort}>
      <ArrowDownNarrowWide className={styles.icon} />

      <select
        onInput={handleInput}
        value={sort}
      >
        <option value="NEWEST">newest</option>
        <option value="OLDEST">oldest</option>
        <option value="RANDOM">random</option>
      </select>
    </div>
  );
};
