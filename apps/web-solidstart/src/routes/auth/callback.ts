import { finishLogin } from "server-graphql";

export const GET = async ({ request }: { request: Request }) => finishLogin(request);
