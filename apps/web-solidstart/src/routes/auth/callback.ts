import { finishLogin } from "server-auth/auth";

export const GET = async ({ request }: { request: Request }) => finishLogin(request);
