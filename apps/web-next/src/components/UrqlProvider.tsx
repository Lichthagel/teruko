"use client";

import type { ReactNode } from "react";

import { urqlClient } from "client-common";
import { Provider } from "urql";

type UrqlProviderProps = {
  children: ReactNode;
};

const UrqlProvider: React.FC<UrqlProviderProps> = ({
  children,
}: UrqlProviderProps) => <Provider value={urqlClient}>{children}</Provider>;

export default UrqlProvider;
