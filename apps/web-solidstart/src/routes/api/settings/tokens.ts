import { userTokenHandler } from "server-auth/routes";

const handler = async ({ request }: { request: Request }) => {
  const response = await userTokenHandler(request);
  return response ?? new Response("Not Found", { status: 404 });
};

export const GET = handler;
export const POST = handler;
