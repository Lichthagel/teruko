import type { Metadata } from "next";

import Nav from "@/components/Nav";
import UrqlProvider from "@/components/UrqlProvider";
import { type ReactElement, StrictMode } from "react";

import "./globals.css";
import "client-css/global.scss";

export const metadata: Metadata = {
  title: "てる子",
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}): ReactElement => (
  <StrictMode>
    <html lang="en">
      <body>
        <Nav />

        <UrqlProvider>{children}</UrqlProvider>
      </body>
    </html>
  </StrictMode>
);

export default RootLayout;
