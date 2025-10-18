import { builder } from "./builder.js";

import { applyMutation } from "./Mutation/index.js";
import { applyQuery } from "./Query/index.js";
import "./Image.js";
import "./Tag.js";
import "./TagCategory.js";

applyQuery(builder);
applyMutation(builder);

export default builder.toSchema();
