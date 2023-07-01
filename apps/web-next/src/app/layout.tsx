import Nav from "@/components/Nav";
import "./globals.css";
import type { Metadata } from "next";
import UrqlProvider from "@/components/UrqlProvider";
import { StrictMode, type ReactElement } from "react";
import { Readex_Pro, M_PLUS_1 } from "next/font/google";
import clsx from "clsx";

const readex_pro = Readex_Pro({
  subsets: ["latin"],
  variable: "--font-readex-pro",
});

const m_plus_1 = M_PLUS_1({
  subsets: ["latin"],
  variable: "--font-m-plus-1",
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
    <html lang="en" className={clsx(readex_pro.variable, m_plus_1.variable)}>
      <body>
        <Nav />

        <UrqlProvider>{children}</UrqlProvider>
      </body>
    </html>
  </StrictMode>
);

export default RootLayout;
