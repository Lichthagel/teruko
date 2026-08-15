import type { JSX } from "@solidjs/web/jsx-runtime";
// import type { LucideIcon } from "lucide-solid";
import type { Component } from "solid-js";
import styles from "client-css/m/button.module.scss";
import { children, omit } from "solid-js";

export type ButtonProps = {
  children?: JSX.Element;
  icon?: unknown;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: Component<ButtonProps> = (props) => {
  const restProps = omit(props, "class", "icon", "children");
  const safeChildren = children(() => props.children);

  return (
    <button class={`${styles.button} ${props.class}`} type="button" {...restProps}>
      {/* {props.icon && <Dynamic component={props.icon} />} */}
      {safeChildren()}
    </button>
  );
};

export default Button;
