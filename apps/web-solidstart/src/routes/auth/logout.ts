import { logout } from "server-graphql";

export const POST = async ({ request }: { request: Request }) => logout(request);
