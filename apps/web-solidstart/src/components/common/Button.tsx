import type { LucideIcon } from "lucide-solid";
import type { Component, JSX } from "solid-js";
import styles from "client-css/m/button.module.scss";
import { children, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

export type ButtonProps = {
  children?: JSX.Element;
  icon?: LucideIcon;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: Component<ButtonProps> = (props_) => {
  const [props, restProps] = splitProps(props_, ["class", "icon", "children"]);
  const safeChildren = children(() => props.children);

  return (
    <button class={`${styles.button} ${props.class}`} type="button" {...restProps}>
      {props.icon && <Dynamic component={props.icon} />}
      {safeChildren()}
    </button>
  );
};

export default Button;
