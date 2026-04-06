import type { LucideIcon } from "lucide-react";
import type { FunctionComponent, InputEventHandler } from "react";
import styles from "client-css/m/select.module.scss";
import { useCallback } from "react";

const Select: FunctionComponent<{
  icon?: LucideIcon;
  options: (string | { value: string; label: string })[];
  value?: string;
  setValue?: (value: string) => void;
}> = ({ icon: Icon, options, value, setValue }) => {
  const handleInput = useCallback<InputEventHandler<HTMLSelectElement>>((event) => {
    event.preventDefault();

    setValue?.(event.currentTarget.value);
  }, [setValue]);

  return (
    <div className={styles.select}>
      {Icon
        && <Icon className={styles.icon} />}

      <select value={value} onInput={handleInput}>
        {options.map(option => (
          <option key={(typeof option === "string" ? option : option.value)} value={typeof option === "string" ? option : option.value}>{typeof option === "string" ? option : option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
