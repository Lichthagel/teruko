import { getYoga } from "server-graphql";

const { handleRequest } = getYoga({ Response });

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
