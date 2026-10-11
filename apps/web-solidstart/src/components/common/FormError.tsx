import type { Component, JSX } from "solid-js";
import styles from "client-css/m/form.module.scss";

const FormError: Component<{ children: JSX.Element }> = props => (
  <p class={styles.formError} role="alert">{props.children}</p>
);

export default FormError;
