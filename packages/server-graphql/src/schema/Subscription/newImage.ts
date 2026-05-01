import { builder } from "#schema/builder.js";
import { PothosImage } from "#schema/Image.js";
import { pubSub } from "../../pubSub.js";

builder.subscriptionField(
  "newImage",
  t => t.field({
    type: PothosImage,
    subscribe: (_parent, _args, _ctx) => pubSub.subscribe("NEW_IMAGE"),
    resolve: value => value,
  }),
);
