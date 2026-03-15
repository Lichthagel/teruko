import type { Data } from "@urql/exchange-graphcache";
import type { TagExt, TagRuleExt } from "models";
import { Client, fetchExchange } from "@urql/core";

import { cacheExchange } from "@urql/exchange-graphcache";
import resolvers from "./resolvers/index.js";

export const urqlClient = new Client({
  url: "/graphql",
  exchanges: [
    cacheExchange({
      keys: {
        Image: data => data.id as string | null,
        Tag: data => data.slug as string | null,
        TagCategory: data => data.slug as string | null,
        TagRule: data => (data.id)?.toString() ?? null,
      },
      resolvers,
      updates: {
        Mutation: {
          createTagRule: (result, args, cache, _info) => {
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
          },
          deleteTagRule: (_result, args, cache, _info) => {
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
          },
        },
      },
    }),
    fetchExchange,
  ],
});
