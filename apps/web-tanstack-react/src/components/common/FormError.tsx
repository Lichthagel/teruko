import type { FunctionComponent, ReactNode } from "react";
import styles from "client-css/m/form.module.scss";

const FormError: FunctionComponent<{ children: ReactNode }> = ({ children }) => (
  <p className={styles.formError} role="alert">{children}</p>
);

export default FormError;
