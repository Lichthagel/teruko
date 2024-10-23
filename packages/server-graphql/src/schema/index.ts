import { builder } from "./builder.js";

applyQuery(builder);
applyMutation(builder);

import "./Image.js";
import { applyMutation } from "./Mutation/index.js";
import { applyQuery } from "./Query/index.js";
import "./Tag.js";
import "./TagCategory.js";

export default builder.toSchema();
