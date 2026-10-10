import { startLogin } from "server-auth/auth";

export const GET = async ({ request }: { request: Request }) => startLogin(request);
