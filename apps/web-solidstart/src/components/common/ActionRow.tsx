import type { Component, JSX } from "solid-js";
import styles from "client-css/m/form.module.scss";

const ActionRow: Component<{ children: JSX.Element }> = props => (
  <div class={styles.actionRow}>{props.children}</div>
);

export default ActionRow;
