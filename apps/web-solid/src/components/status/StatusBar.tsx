import type { Component } from "solid-js";
import styles from "client-css/m/status.module.scss";

export const StatusBar: Component<{
  error?: boolean;
  fetching?: boolean;
}> = (props) => {
  return (
    <div
      classList={{
        [styles.bar]: true,
        [styles.busy]: props.fetching,
        [styles.error]: props.error,
      }}
    />
  );
};
