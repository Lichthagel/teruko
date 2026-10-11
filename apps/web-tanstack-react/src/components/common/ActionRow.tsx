import type { FunctionComponent, ReactNode } from "react";
import styles from "client-css/m/form.module.scss";

const ActionRow: FunctionComponent<{ children: ReactNode }> = ({ children }) => (
  <div className={styles.actionRow}>{children}</div>
);

export default ActionRow;
