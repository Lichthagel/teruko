import type { Metadata } from "next";

import Nav from "@/components/Nav";
import UrqlProvider from "@/components/UrqlProvider";
import clsx from "clsx";
import { M_PLUS_2, Sora } from "next/font/google";
import { type ReactElement, StrictMode } from "react";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const m_plus_2 = M_PLUS_2({
  subsets: ["latin"],
  variable: "--font-m-plus-2",
});

export const metadata: Metadata = {
  title: "てる子",
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}): ReactElement => (
  <StrictMode>
    <html className={clsx(sora.variable, m_plus_2.variable)} lang="en">
      <body>
        <Nav />

        <UrqlProvider>{children}</UrqlProvider>
      </body>
    </html>
  </StrictMode>
);

export default RootLayout;
