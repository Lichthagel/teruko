import type { FunctionComponent } from "react";
import styles from "client-css/m/checkbox.module.scss";

const Checkbox: FunctionComponent<{
  checked: boolean;
  setChecked: (value: boolean) => void;
  label: string;
}> = ({ checked, setChecked, label }) => {
  return (
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => setChecked(e.currentTarget.checked)}
      />
      <span className={styles.checkmark} />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
