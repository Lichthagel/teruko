import type { RequestHandler } from "@sveltejs/kit";
import { authHandler } from "server-graphql";

export const GET: RequestHandler = async ({ request }) => {
  return await authHandler(request) ?? new Response("Not Found", { status: 404 });
};
export const POST: RequestHandler = async ({ request }) => await authHandler(request) ?? new Response("Not Found", { status: 404 });
export const DELETE: RequestHandler = async ({ request }) => await authHandler(request) ?? new Response("Not Found", { status: 404 });
