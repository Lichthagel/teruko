// eslint-disable-next-line n/no-extraneous-import
import type {} from "@whatwg-node/server";

import { getYoga } from "server-graphql";

const { handleRequest } = getYoga({ Response });

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
