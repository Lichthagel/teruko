import type { UpdateResolver } from "@urql/exchange-graphcache";

const updateTag: UpdateResolver = (_result, args, cache, _info) => {
  cache.invalidate({ __typename: "Tag", slug: args.slug as string });
};

export default updateTag;
