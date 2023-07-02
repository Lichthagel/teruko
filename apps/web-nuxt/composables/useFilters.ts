import { ImageSort, zImageSort } from "models";

const useFilters = () => {
  const route = useRoute();

  const sort = computed(
    () => zImageSort.nullish().parse(route.query.sort) ?? "NEWEST"
  );
  const tags = computed(() => {
    if (Array.isArray(route.query.tag)) {
      return route.query.tag.filter((tag): tag is string => !!tag);
    } else if (typeof route.query.tag === "string") {
      return [route.query.tag];
    } else {
      return [];
    }
  });

  return {
    sort,
    setSort: (sort: ImageSort) => {
      navigateTo({
        query: {
          ...route.query,
          sort,
        },
      });
    },
    tags,
    setTags: (tags?: string[]) => {
      navigateTo({
        query: {
          ...route.query,
          tag: tags,
        },
      });
    },
  };
};

export default useFilters;
