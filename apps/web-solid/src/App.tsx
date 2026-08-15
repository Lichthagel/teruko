import { Title } from "@solidjs/meta";
import { Provider } from "@urql/solid";
import { urqlClient } from "client-graphql";
import { Loading } from "solid-js";
import Nav from "./components/Nav";
import { Router } from "./router";
// A typed, validated client env var, baked into the bundle at build time
// (defaults applied — see env.ts).
import "./App.css";

// The app root: the router and the site-wide layout live here. Pages are
// the modules under src/routes.
export default function App() {
  return (
    <Router>
      {props => (
        <Provider value={urqlClient}>
          <Title>てる子</Title>
          <Nav />
          <Loading fallback={<main>Loading…</main>}>{props.children}</Loading>
        </Provider>
      )}
    </Router>
  );
}
