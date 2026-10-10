import type { Image } from "models";
import { createPubSub } from "graphql-yoga";

export const pubSub = createPubSub<{
  NEW_IMAGE: [Image];
}>();
