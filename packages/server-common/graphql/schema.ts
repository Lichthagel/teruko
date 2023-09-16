import { builder } from "./builder";

applyQuery(builder);
applyMutation(builder);

import "./Image";
import { applyMutation } from "./Mutation";
import { applyQuery } from "./Query";
import "./Tag";
import "./TagCategory";

export default builder.toSchema();
