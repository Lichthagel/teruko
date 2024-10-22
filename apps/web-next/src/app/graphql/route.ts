import { getYoga } from "server-graphql";

const { handleRequest } = getYoga({ Response });

const handler = (req: Request) => handleRequest(req, {});

export {
  handler as GET,
  handler as POST,
  handler as OPTIONS,
};
