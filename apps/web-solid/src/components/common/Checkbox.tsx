import type { Component } from "solid-js";
import styles from "client-css/m/checkbox.module.scss";

const Checkbox: Component<{
  checked: boolean;
  setChecked: (value: boolean) => void;
  label: string;
}> = (props) => {
  return (
    <label class={styles.checkbox}>
      <input
        type="checkbox"
        checked={props.checked}
        onInput={e => props.setChecked(e.currentTarget.checked)}
      />
      <span class={styles.checkmark} />
      <span>{props.label}</span>
    </label>
  );
};

export default Checkbox;
