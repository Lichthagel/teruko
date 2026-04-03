import type { ImageSort } from "models";
import { createContext } from "react";

export const FiltersContext = createContext<{ tags: string[]; sort: ImageSort }>({ tags: [], sort: "NEWEST" });
