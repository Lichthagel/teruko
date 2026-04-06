import type { JSX } from "solid-js";
import styles from "client-css/m/filters.module.scss";
import { ArrowDownNarrowWide } from "lucide-solid";
import { zImageSort } from "models";
import { setSort, sort } from "~/utils/filters";

export const SortSelect = () => {
  const handleInput: JSX.EventHandler<HTMLSelectElement, Event> = (event) => {
    event.preventDefault();

    setSort(zImageSort.parse(event.currentTarget.value));
  };

  return (
    <div class={styles.sort}>
      <ArrowDownNarrowWide class={styles.icon} />

      <select
        onInput={handleInput}
        value={sort()}
      >
        <option value="NEWEST">newest</option>
        <option value="OLDEST">oldest</option>
        <option value="RANDOM">random</option>
      </select>
    </div>
  );
};
