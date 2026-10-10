import { startLogin } from "server-graphql";

export const GET = async ({ request }: { request: Request }) => startLogin(request);
