import styles from "client-css/m/status.module.scss";
import clsx from "clsx";

type StatusBarProps = {
  busy: boolean;
  error: boolean;
};

const StatusBar = ({ busy, error }: StatusBarProps) => (
  <div
    className={clsx(
      styles.bar,
      error && styles.error,
      busy && styles.busy,
    )}
  />
);

export default StatusBar;
