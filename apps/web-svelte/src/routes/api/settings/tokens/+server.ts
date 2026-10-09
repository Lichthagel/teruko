import type { RequestHandler } from "@sveltejs/kit";
import { userTokenHandler } from "server-graphql";

const handler: RequestHandler = async ({ request }) =>
  await userTokenHandler(request) ?? new Response("Not Found", { status: 404 });

export const GET: RequestHandler = handler;
export const POST: RequestHandler = handler;
