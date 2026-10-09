import { userTokenHandler } from "server-graphql";

const handler = async ({ request }: { request: Request }) =>
  await userTokenHandler(request) ?? new Response("Not Found", { status: 404 });

export const GET = handler;
export const POST = handler;
