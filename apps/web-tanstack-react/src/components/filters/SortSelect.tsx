import { ArrowDownNarrowWide } from "lucide-react";
import { useFilters } from "#/stores/filters";
import Select from "../common/Select";

export const SortSelect = () => {
  const { sort, setSort } = useFilters();

  return (
    <Select
      options={[{ value: "NEWEST", label: "newest" }, { value: "OLDEST", label: "oldest" }, { value: "RANDOM", label: "random" }]}
      icon={ArrowDownNarrowWide}
      value={sort}
      setValue={v => setSort(v as typeof sort)}
    />
  );
};
