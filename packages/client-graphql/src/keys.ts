import type { KeyingConfig } from "@urql/exchange-graphcache";

const keys: KeyingConfig = {
  Image: data => data.id as string | null,
  Tag: data => data.slug as string | null,
  TagCategory: data => data.slug as string | null,
  TagRule: data => (data.id)?.toString() ?? null,
};

export default keys;
