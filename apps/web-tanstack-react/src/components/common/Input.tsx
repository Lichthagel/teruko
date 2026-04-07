import type { FunctionComponent, InputHTMLAttributes } from "react";
import styles from "client-css/m/input.module.scss";

export type InputProps = {
  value: string;
  setValue: (value: string) => void;
} & InputHTMLAttributes<HTMLInputElement>;

const Input: FunctionComponent<InputProps> = ({ value, setValue, ...restProps }) => {
  return (
    <div className={styles.container}>
      <input
        type="text"
        value={value}
        onInput={event => setValue(event.currentTarget.value)}
        {...restProps}
      />
    </div>
  );
};

export default Input;
