import { useStore } from "@nanostores/react";
import styles from "client-css/m/filters.module.scss";
import { sortStore } from "client-stores";
import { ArrowDownNarrowWide } from "lucide-react";
import { ImageSort } from "models";

const SortSelect = () => {
  const sort = useStore(sortStore) ?? "NEWEST";

  const setSort = (sort: ImageSort) => {
    sortStore.set(sort);
  };

  return (
    <div className={styles.sort}>
      <ArrowDownNarrowWide className={styles.icon} />

      <select
        onChange={(e) => setSort(e.target.value as ImageSort)}
        value={sort}
      >
        <option value="NEWEST">newest</option>
        <option value="OLDEST">oldest</option>
        <option value="RANDOM">random</option>
      </select>
    </div>
  );
};

export default SortSelect;
