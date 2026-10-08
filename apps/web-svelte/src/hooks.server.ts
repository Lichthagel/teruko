import type { Handle } from "@sveltejs/kit/hooks";
import { protectRequest } from "server-graphql";

export const handle: Handle = async ({ event, resolve }) => {
  const response = await protectRequest(event.request);
  if (response) {
    return response;
  }
  return resolve(event);
};
