import type { RequestHandler } from "@sveltejs/kit";
import { startLogin } from "server-graphql";

export const GET: RequestHandler = async ({ request }) => startLogin(request);
