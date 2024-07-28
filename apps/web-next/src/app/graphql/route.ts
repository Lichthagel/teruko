import { getYoga } from "server-graphql";

const { handleRequest }: any = getYoga({ Response });

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
