import { createMiddleware } from "@solidjs/start/middleware";
import { protectAppRequest } from "server-auth/routes";

export default createMiddleware({
  onRequest: [async (event) => {
    if (new URL(event.request.url).pathname === "/graphql")
      return;
    const response = await protectAppRequest(event.request);
    if (response) {
      event.response.status = response.status;
      return response;
    }
  }],
});
