import { ImageSort } from "models";
import { sortStore } from "client-common/stores";
import { useStore } from "@nanostores/react";

const SortSelect = () => {
  const sort = useStore(sortStore) ?? "NEWEST";

  const setSort = (sort: ImageSort) => {
    sortStore.set(sort);
  };

  return (
    <select
      className="h-10 w-24 rounded bg-base-100 px-2"
      value={sort}
      onChange={(e) => setSort(e.target.value as ImageSort)}
    >
      <option value="NEWEST">newest</option>
      <option value="OLDEST">oldest</option>
      <option value="RANDOM">random</option>
    </select>
  );
};

export default SortSelect;
