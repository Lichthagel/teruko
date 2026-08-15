import type { Component, JSX } from "solid-js";
import styles from "client-css/m/input.module.scss";
import { splitProps } from "solid-js";

export type InputProps = {
  value: string;
  setValue: (value: string) => void;
} & JSX.InputHTMLAttributes<HTMLInputElement>;

const Input: Component<InputProps> = (props_) => {
  const [props, restProps] = splitProps(props_, ["value", "setValue"]);

  return (
    <div class={styles.container}>
      <input
        type="text"
        value={props.value}
        onInput={event => props.setValue(event.currentTarget.value)}
        {...restProps}
      />
    </div>
  );
};

export default Input;
