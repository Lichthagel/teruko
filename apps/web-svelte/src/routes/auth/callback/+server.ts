import type { RequestHandler } from "@sveltejs/kit";
import { finishLogin } from "server-auth/auth";

export const GET: RequestHandler = async ({ request }) => finishLogin(request);
