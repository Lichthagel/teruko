import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Provider } from "@urql/solid";
import { urqlClient } from "client-graphql";
import { Suspense } from "solid-js";

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Provider value={urqlClient}>
            <Title>てる子</Title>
            <Suspense>{props.children}</Suspense>
          </Provider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
