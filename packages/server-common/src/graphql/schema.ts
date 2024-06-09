/* eslint-disable no-use-before-define */
import { builder } from "./builder.js";

applyQuery(builder);
applyMutation(builder);

import "./Image";
import { applyMutation } from "./Mutation/index.js";
import { applyQuery } from "./Query/index.js";
import "./Tag";
import "./TagCategory";

export default builder.toSchema();
