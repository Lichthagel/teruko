import type { FunctionComponent } from "react";
import styles from "client-css/m/status.module.scss";

const StatusBar: FunctionComponent<{ error?: boolean; fetching?: boolean }> = ({ fetching, error }) => {
  return (<div className={`${styles.bar}${fetching ? ` ${styles.busy}` : ""}${error ? ` ${styles.error}` : ""}`}></div>
  );
};

export default StatusBar;
