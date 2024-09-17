import { ResolverConfig } from "@urql/exchange-graphcache";

import Image from "./Image.js";
import Query from "./Query/index.js";

export default {
  Query,
  Image,
} satisfies ResolverConfig;
