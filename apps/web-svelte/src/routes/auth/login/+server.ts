import type { RequestHandler } from "@sveltejs/kit";
import { startLogin } from "server-auth/auth";

export const GET: RequestHandler = async ({ request }) => startLogin(request);
