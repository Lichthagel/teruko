import type { ImageSort } from "models";
import type { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { createContext, use, useState } from "react";

export const FiltersContext = createContext<Readonly<{
  tags: readonly string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  sort: ImageSort;
  setSort: Dispatch<SetStateAction<ImageSort>>;
}>>({
  tags: [],
  setTags: () => {},
  sort: "NEWEST",
  setSort: () => {},
});

export const useFilters = () => use(FiltersContext);

export const FiltersProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [sort, setSort] = useState<ImageSort>("NEWEST");

  return (
    <FiltersContext value={{ tags, setTags, sort, setSort }}>
      {children}
    </FiltersContext>
  );
};
