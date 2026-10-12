import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Provider } from "@urql/solid";
import { createUrqlClient, urqlClient } from "client-graphql";
import { Suspense } from "solid-js";
import { getRequestEvent, isServer } from "solid-js/web";
import Nav from "./components/Nav";
import "client-css/global.scss";

export default function App() {
  const client = isServer
    ? createUrqlClient(new URL("/graphql", getRequestEvent()!.request.url).toString())
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
