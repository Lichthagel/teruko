import { getYoga, protectGraphqlRequest } from "server-graphql";

const yogaApp = getYoga({ Response });
const requestUrl = (event: Parameters<Parameters<typeof defineEventHandler>[0]>[0]) => {
  const host = event.node.req.headers.host ?? "localhost";
  const forwardedProto = event.node.req.headers["x-forwarded-proto"];
  const protocol = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) === "https" ? "https" : "http";
  return new URL(event.node.req.url ?? "/", `${protocol}://${host}`);
};

export default defineEventHandler(
  async (event) => {
    const request = new Request(requestUrl(event), {
      method: event.node.req.method,
      headers: event.node.req.headers as HeadersInit,
      body: ["GET", "HEAD"].includes(event.node.req.method ?? "GET") ? undefined : event.node.req,
      duplex: "half",
    } as RequestInit);
    if (event.node.req.method === "OPTIONS") {
      return yogaApp(request);
    }
    const protectedResponse = await protectGraphqlRequest(request);
    if (protectedResponse) {
      event.node.res.statusCode = protectedResponse.status;
      protectedResponse.headers.forEach((value, name) => event.node.res.setHeader(name, value));
      event.node.res.end(await protectedResponse.text());
      return;
    }
    return yogaApp(request);
  },
);
