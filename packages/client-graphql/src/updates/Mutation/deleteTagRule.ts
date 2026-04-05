import type { UpdateResolver } from "@urql/exchange-graphcache";
import type { TagExt } from "models";

const deleteTagRule: UpdateResolver = (_result, args, cache, _info) => {
  const id = args.id as number;
  const ruleEntity = {
    __typename: "TagRule",
    id,
  };
  const ruleKey = cache.keyOfEntity(ruleEntity)!;

  const tag = cache.resolve(ruleEntity, "tag") as TagExt & { __typename: string };
  const prevRules = cache.resolve(tag, "rules") as string[] | undefined;
  if (prevRules) {
    cache.link(
      tag,
      "rules",
      prevRules.filter(r => r !== ruleKey),
    );
  }

  const otherTag = cache.resolve(ruleEntity, "otherTag") as TagExt & { __typename: string };
  const prevReferencingRules = cache.resolve(otherTag, "referencingRules") as string[] | undefined;
  if (prevReferencingRules) {
    cache.link(
      otherTag,
      "referencingRules",
      prevReferencingRules.filter(r => r !== ruleKey),
    );
  }

  cache.invalidate(ruleEntity);
};

export default deleteTagRule;
