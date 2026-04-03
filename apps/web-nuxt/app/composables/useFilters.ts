import type { ImageSort } from "models";

const tags = ref<string[]>([]);
const sort = ref<ImageSort>("NEWEST");

export const useFilters = () => {
  return { tags, sort };
};
