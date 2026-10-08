import { createCsrfMiddleware, createMiddleware, createStart } from "@tanstack/react-start";
import { protectRequest } from "server-graphql";

const authMiddleware = createMiddleware({ type: "request" }).server(async ({ request, next }) => {
  const response = await protectRequest(request);
  if (response) {
    return response;
  }
  return next();
});

export const startInstance = createStart(() => ({ requestMiddleware: [createCsrfMiddleware({ filter: ctx => ctx.handlerType === "serverFn" }), authMiddleware] }));
