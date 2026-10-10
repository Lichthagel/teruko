import type { RequestHandler } from "@sveltejs/kit";
import { finishLogin } from "server-graphql";

export const GET: RequestHandler = async ({ request }) => finishLogin(request);
