import { createCsrfMiddleware, createMiddleware, createStart } from "@tanstack/react-start";
import { protectAppRequest } from "server-auth/routes";

const authMiddleware = createMiddleware({ type: "request" }).server(async ({ request, next }) => {
  if (new URL(request.url).pathname === "/graphql")
    return next();
  const response = await protectAppRequest(request);
  if (response) {
    return response;
  }
  return next();
});

export const startInstance = createStart(() => ({ requestMiddleware: [createCsrfMiddleware({ filter: ctx => ctx.handlerType === "serverFn" }), authMiddleware] }));
