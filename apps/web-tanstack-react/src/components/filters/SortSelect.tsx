import { useFilters } from "#/stores/filters";
import { ArrowDownNarrowWide } from "lucide-react";
import { zImageSort } from "models";
import { useCallback } from "react";
import Select from "../common/Select";

export const SortSelect = () => {
  const { sort, setSort } = useFilters();

  const handleInput = useCallback(
    (value: string) => setSort(zImageSort.parse(value)),
    [setSort],
  );

  return (
    <Select
      options={[{ value: "NEWEST", label: "newest" }, { value: "OLDEST", label: "oldest" }, { value: "RANDOM", label: "random" }]}
      icon={ArrowDownNarrowWide}
      value={sort}
      setValue={handleInput}
    />
  );
};
