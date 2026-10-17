import type { Component, JSX } from "solid-js";
import styles from "client-css/m/form.module.scss";

const Panel: Component<{ id: string; title: string; children: JSX.Element }> = props => (
  <section class={styles.panel} aria-labelledby={props.id}>
    <h2 id={props.id} class={styles.panelTitle}>{props.title}</h2>
    {props.children}
  </section>
);

export default Panel;
