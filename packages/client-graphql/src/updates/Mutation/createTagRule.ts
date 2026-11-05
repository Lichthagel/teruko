import type { Data, UpdateResolver } from "@urql/exchange-graphcache";
import type { TagRuleExt } from "models";

const createTagRule: UpdateResolver = (result, args, cache, _info) => {
  const tagEntity = { __typename: "Tag", slug: (result.createTagRule as TagRuleExt).tag?.slug ?? args.tagSlug as string };
  const otherTagEntity = { __typename: "Tag", slug: (result.createTagRule as TagRuleExt).otherTag?.slug ?? args.otherTagSlug as string };

  const prevRules = cache.resolve(tagEntity, "rules");
  if (prevRules) {
    cache.link(tagEntity, "rules", [...(prevRules as Data[]), result.createTagRule as Data]);
  }

  const prevReferencingRules = cache.resolve(otherTagEntity, "referencingRules");
  if (prevReferencingRules) {
    cache.link(otherTagEntity, "referencingRules", [...prevReferencingRules as Data[], result.createTagRule as Data]);
  }
};

export default createTagRule;
