import { ResolverConfig } from "@urql/exchange-graphcache";

import Image from "./Image";
import Query from "./Query";

export default {
  Query,
  Image,
} satisfies ResolverConfig;
