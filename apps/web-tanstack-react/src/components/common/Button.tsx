import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, FunctionComponent, ReactNode } from "react";
import styles from "client-css/m/button.module.scss";

export type ButtonProps = {
  children?: ReactNode;
  icon?: LucideIcon;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FunctionComponent<ButtonProps> = ({ icon: Icon, className, children, ...restProps }) => {
  return (
    <button className={`${styles.button} ${className}`} type="button" {...restProps}>
      {Icon && <Icon />}
      {children}
    </button>
  );
};

export default Button;
