import type { UpdatesConfig } from "@urql/exchange-graphcache";
import createTagRule from "./createTagRule.js";
import deleteTagRule from "./deleteTagRule.js";
import updateTag from "./updateTag.js";

const Mutation: UpdatesConfig["Mutation"] = {
  createTagRule,
  deleteTagRule,
  updateTag,
};

export default Mutation;
