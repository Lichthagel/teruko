import type { Component, JSX } from "solid-js";
import styles from "client-css/m/loader.module.scss";
import { splitProps } from "solid-js";

const SkeletonLoader: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props_) => {
  const [props, restProps] = splitProps(props_, ["class"]);

  return <div class={`${styles.skeleton} ${props.class}`} {...restProps} />;
};

export default SkeletonLoader;
