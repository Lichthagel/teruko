import Nav from "#/components/Nav";
import { FiltersContext } from "#/contexts/FiltersContext";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import globalCss from "client-css/global.scss?url";
import { urqlClient } from "client-graphql";
import { Provider } from "urql";

const RootDocument = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Nav />
        <Provider value={urqlClient}>
          <FiltersContext value={{ tags: [], sort: "NEWEST" }}>
            {children}
          </FiltersContext>
        </Provider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "てる子",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: globalCss,
      },
      {
        rel: "icon",
        href: "data:,",
      },
    ],
  }),
  shellComponent: RootDocument,
});
