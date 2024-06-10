import { getYoga } from "server-graphql";

const yogaApp = getYoga({ Response });

export { yogaApp as GET, yogaApp as POST, yogaApp as OPTIONS };
