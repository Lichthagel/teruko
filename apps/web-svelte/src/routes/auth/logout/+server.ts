import type { RequestHandler } from "@sveltejs/kit";
import { logout } from "server-graphql";

export const POST: RequestHandler = async ({ request }) => logout(request);
