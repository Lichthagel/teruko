import { authHandler, getYoga, protectRequest } from "server-graphql";

const yoga = getYoga({ Response });
const yogaApp = async ({ request }: { request: Request }) => {
  if (request.method === "OPTIONS") {
    return yoga(request);
  }
  const authResponse = await authHandler(request);
  if (authResponse)
    return authResponse;
  const protectedResponse = await protectRequest(request);
  return protectedResponse ?? yoga(request);
};

export { yogaApp as GET, yogaApp as OPTIONS, yogaApp as POST };
