import type { RequestHandler } from "@sveltejs/kit";
import { logout } from "server-auth/auth";

export const POST: RequestHandler = async ({ request }) => logout(request);
