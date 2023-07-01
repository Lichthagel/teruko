"use client";

import type { ReactNode } from "react";
import { Provider } from "urql";
import { urqlClient } from "client-common";

type UrqlProviderProps = {
  children: ReactNode;
};

const UrqlProvider: React.FC<UrqlProviderProps> = ({
  children,
}: UrqlProviderProps) => <Provider value={urqlClient}>{children}</Provider>;

export default UrqlProvider;
