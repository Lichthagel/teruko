import type { APIHandler } from "filesystem-routing/api";
import { getYoga } from "server-graphql";

const yogaApp = getYoga({ Response }) satisfies APIHandler;

export { yogaApp as GET, yogaApp as OPTIONS, yogaApp as POST };
