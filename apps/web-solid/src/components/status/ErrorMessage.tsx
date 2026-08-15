import type { Component } from "solid-js";
import styles from "client-css/m/error.module.scss";
// import { House } from "lucide-solid";
import { Show } from "solid-js";

const ErrorMessage: Component<{
  error?: Error;
  message?: string;
  subtitle?: string;
  title?: string;
}> = (props) => {
  return (
    <div class={styles.backdrop}>
      <div class="container">
        <div class={styles.above}>
          <a href="/">
            {/* <House /> */}
            <span>return home</span>
          </a>
        </div>
        <div class={styles.content}>
          <h1>{props.title || "An error occurred"}</h1>
          <Show when={props.subtitle || props.error}>
            <h2>{props.subtitle || props.error?.message}</h2>
          </Show>
          <Show when={props.message}>
            <span>{props.message}</span>
          </Show>
        </div>
      </div>
    </div>

  );
};

export default ErrorMessage;
