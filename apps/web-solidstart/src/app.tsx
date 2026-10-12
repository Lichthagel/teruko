import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Client } from "@urql/core";
import { Provider } from "@urql/solid";
import { createUrqlOptions, urqlClient } from "client-graphql";
import { Suspense } from "solid-js";
import { getRequestEvent, isServer } from "solid-js/web";
import Nav from "./components/Nav";
import "client-css/global.scss";

export default function App() {
  const request = isServer ? getRequestEvent()!.request : undefined;
  const requestUrl = request ? new URL(request.url) : undefined;
  const forwardedHost = request?.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto = request?.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const origin = request?.headers.get("origin")
    ?? `${forwardedProto === "https" ? "https" : requestUrl?.protocol.slice(0, -1)}://${forwardedHost ?? requestUrl?.host}`;
  const client = request
    ? new Client({
        ...createUrqlOptions(new URL("/graphql", request.url).toString()),
        fetchOptions: {
          headers: {
            ...(request.headers.get("cookie") ? { cookie: request.headers.get("cookie")! } : {}),
            origin,
          },
        },
      })
    : urqlClient;

  return (
    <Router
      root={props => (
        <MetaProvider>
          <Provider value={client}>
            <Title>てる子</Title>
            <Nav />
            <Suspense>{props.children}</Suspense>
          </Provider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
