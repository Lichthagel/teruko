import type { ImageSort } from "models";

export const filters = $state<{
  tags: string[];
  sort: ImageSort;
}>({
  tags: [],
  sort: "NEWEST",
 });
