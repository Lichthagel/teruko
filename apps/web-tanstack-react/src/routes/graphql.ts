import { createFileRoute } from "@tanstack/react-router";
import { getYoga } from "server-graphql";

const yogaApp = getYoga({ Response });

export const Route = createFileRoute("/graphql")({
  server: {
    handlers: {
      GET: yogaApp,
      OPTIONS: yogaApp,
      POST: yogaApp,
    },
  },
});
