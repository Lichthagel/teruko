import type { Handle } from "@sveltejs/kit/hooks";
import { protectAppRequest } from "server-auth/routes";

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname === "/graphql")
    return resolve(event);
  const response = await protectAppRequest(event.request);
  if (response) {
    return response;
  }
  return resolve(event);
};
