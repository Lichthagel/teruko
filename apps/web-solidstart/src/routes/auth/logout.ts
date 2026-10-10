import { logout } from "server-auth/auth";

export const POST = async ({ request }: { request: Request }) => logout(request);
