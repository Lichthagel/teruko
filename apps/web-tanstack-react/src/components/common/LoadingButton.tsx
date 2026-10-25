import type { ButtonHTMLAttributes, FunctionComponent, ReactNode } from "react";
import styles from "client-css/m/form.module.scss";

type LoadingButtonProps = {
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const LoadingButton: FunctionComponent<LoadingButtonProps> = ({
  loading = false,
  loadingLabel = "Loading",
  className,
  children,
  disabled,
  "aria-label": ariaLabel,
  type = "button",
  ...restProps
}) => (
  <button
    className={`${styles.buttonPrimary} ${className ?? ""}`}
    type={type}
    {...restProps}
    disabled={disabled || loading}
    aria-busy={loading}
    aria-label={loading ? loadingLabel : ariaLabel}
  >
    {children}
  </button>
);

export default LoadingButton;
