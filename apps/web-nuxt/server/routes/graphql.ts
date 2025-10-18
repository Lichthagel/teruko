import { getYoga } from "server-graphql";

const yogaApp = getYoga(undefined);

export default defineEventHandler(async (event) => {
  const { req, res } = event.node;

  return yogaApp(req, res);
});
