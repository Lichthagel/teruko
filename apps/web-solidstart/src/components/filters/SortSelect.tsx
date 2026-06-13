import { ArrowDownNarrowWide } from "lucide-solid";
import { setSort, sort } from "~/utils/filters";
import Select from "../common/Select";

export const SortSelect = () =>
  (
    <Select
      options={[{ value: "NEWEST", label: "newest" }, { value: "OLDEST", label: "oldest" }, { value: "RANDOM", label: "random" }]}
      icon={ArrowDownNarrowWide}
      value={sort()}
      setValue={setSort}
    />
  );
