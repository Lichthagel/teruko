import { createMiddleware } from "@solidjs/start/middleware";
import { protectRequest } from "server-graphql";

export default createMiddleware({
  onRequest: [async (event) => {
    const response = await protectRequest(event.request);
    if (response) {
      event.response.status = response.status;
      response.headers.forEach((value, key) => event.response.headers.set(key, value));
      return response;
    }
  }],
});
