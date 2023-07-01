import { getYoga, type YogaServerInstance } from "server-common/graphql";

const yogaApp: YogaServerInstance<object, object> = getYoga(globalThis);

export { yogaApp as GET, yogaApp as POST };
