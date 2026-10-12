import { getYoga } from "server-graphql";

const yogaApp = getYoga(undefined);

export default defineEventHandler(
  async event =>
    yogaApp(event.req, event.res),
);
