import type { UpdatesConfig } from "@urql/exchange-graphcache";
import createTagRule from "./createTagRule.js";
import deleteTagRule from "./deleteTagRule.js";

const Mutation: UpdatesConfig["Mutation"] = {
  createTagRule,
  deleteTagRule,
};

export default Mutation;
