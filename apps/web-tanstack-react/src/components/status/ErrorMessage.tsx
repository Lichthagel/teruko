import type { FunctionComponent } from "react";
import { Link } from "@tanstack/react-router";
import styles from "client-css/m/error.module.scss";
import { House } from "lucide-react";

const ErrorMessage: FunctionComponent<{
  error?: Error;
  message?: string;
  subtitle?: string;
  title?: string;
}> = ({ error, message, subtitle, title }) => {
  return (

    <div className={styles.backdrop}>
      <div className="container">
        <div className={styles.above}>
          <Link to="/">
            <House />
            <span>return home</span>
          </Link>
        </div>
        <div className={styles.content}>
          <h1>{title || "An error occurred"}</h1>
          {(subtitle || error)
            && <h2>{subtitle || error?.message}</h2>}
          {!!message
            && <span>{message}</span>}
        </div>
      </div>
    </div>

  );
};

export default ErrorMessage;
