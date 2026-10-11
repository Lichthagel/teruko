import type { Component, JSX } from "solid-js";
import styles from "client-css/m/form.module.scss";

const PageLayout: Component<{ title: string; children: JSX.Element }> = props => (
  <main class={styles.page}>
    <h1 class={styles.pageTitle}>{props.title}</h1>
    {props.children}
  </main>
);

export default PageLayout;
