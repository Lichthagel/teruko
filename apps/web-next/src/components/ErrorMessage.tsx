import styles from "client-css/m/error.module.scss";
import { Home } from "lucide-react";

type ErrorMessageProps = {
  title?: string;
  subtitle?: string;
  message?: string;
  error?: Error;
};

const ErrorMessage = ({
  title,
  subtitle,
  message,
  error,
}: ErrorMessageProps) => (
  <div className={styles.backdrop}>
    <div className="container">
      <div className={styles.above}>
        <a href="/">
          <Home />
          <span>return home</span>
        </a>
      </div>
      <div className={styles.content}>
        <h1>{title || "An error occurred"}</h1>
        {subtitle ||
          (error && (
            <h2>{subtitle || error?.message}</h2>
          ))}
        {message && <span>{message}</span>}
      </div>
    </div>
  </div>
);

export default ErrorMessage;
