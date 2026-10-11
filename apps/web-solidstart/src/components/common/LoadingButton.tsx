import type { Component, JSX } from "solid-js";
import styles from "client-css/m/form.module.scss";
import { splitProps } from "solid-js";

type LoadingButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
  children: JSX.Element;
};

const LoadingButton: Component<LoadingButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "loading", "loadingLabel", "children", "type"]);
  return (
    <button
      {...rest}
      class={`${styles.buttonPrimary} ${local.class ?? ""}`}
      type={local.type ?? "button"}
      disabled={rest.disabled || local.loading}
      aria-busy={local.loading ?? false}
      aria-label={local.loading ? local.loadingLabel ?? "Loading" : rest["aria-label"]}
    >
      {local.children}
    </button>
  );
};

export default LoadingButton;
