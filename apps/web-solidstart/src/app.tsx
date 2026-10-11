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
  const client = request
    ? new Client({
        ...createUrqlOptions(new URL("/graphql", request.url).toString()),
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          const cookie = request.headers.get("cookie");
          if (cookie)
            headers.set("cookie", cookie);
          const requestUrl = new URL(request.url);
          const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
          const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
          const origin = request.headers.get("origin")
            ?? `${forwardedProto === "https" ? "https" : requestUrl.protocol.slice(0, -1)}://${forwardedHost ?? requestUrl.host}`;
          headers.set("origin", origin);
          return fetch(input, { ...init, headers });
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
