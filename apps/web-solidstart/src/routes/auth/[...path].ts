import { authHandler } from "server-graphql";

const handler = async ({ request }: { request: Request }) => await authHandler(request) ?? new Response("Not Found", { status: 404 });

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
