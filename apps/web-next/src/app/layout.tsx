import Nav from "@/components/Nav";
import "./globals.css";
import type { Metadata } from "next";
import UrqlProvider from "@/components/UrqlProvider";
import { StrictMode, type ReactElement } from "react";
import { Sora, M_PLUS_2 } from "next/font/google";
import clsx from "clsx";

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
    <html lang="en" className={clsx(sora.variable, m_plus_2.variable)}>
      <body>
        <Nav />

        <UrqlProvider>{children}</UrqlProvider>
      </body>
    </html>
  </StrictMode>
);

export default RootLayout;
