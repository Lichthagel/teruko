import type { RequestHandler } from "@sveltejs/kit";
import { userTokenHandler } from "server-auth/routes";

const handler: RequestHandler = async ({ request }) => {
  const response = await userTokenHandler(request);
  return response ?? new Response("Not Found", { status: 404 });
};

export const GET: RequestHandler = handler;
export const POST: RequestHandler = handler;
