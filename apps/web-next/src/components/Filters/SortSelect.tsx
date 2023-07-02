import { ImageSort, zImageSort } from "models";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SortSelect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = zImageSort.nullish().parse(searchParams.get("sort")) ?? "NEWEST";

  const setSort = (sort: ImageSort) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    newSearchParams.set("sort", sort);

    router.push(`${pathname}?${newSearchParams.toString()}`);
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
