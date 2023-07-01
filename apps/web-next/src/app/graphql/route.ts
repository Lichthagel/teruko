import { getYoga } from "server-common/graphql";

const { handleRequest } = getYoga({ Response });

export { handleRequest as GET, handleRequest as POST };
