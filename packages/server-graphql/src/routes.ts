import process from "node:process";
import { authenticateRequest } from "server-auth/auth";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
});

export const requireGraphqlUser = async (request: Request) => {
  if (process.env.NODE_ENV === "test" && process.env.AUTH_TEST_BYPASS === "1" && (!request.headers.get("authorization")?.startsWith("Bearer ") || process.env.AUTH_TEST_ALLOW_BEARER !== "1"))
    return { subject: "teruko-e2e-test-user", email: "test@example.invalid" };
  return authenticateRequest(request);
};

export const protectGraphqlRequest = async (request: Request) => {
  if (request.method === "OPTIONS")
    return null;
  return await requireGraphqlUser(request) ? null : json({ errors: [{ message: "Unauthorized" }] }, 401);
};
