import type { FunctionComponent } from "react";
import styles from "client-css/m/form.module.scss";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CopyableSecretProps = {
  value: string;
  label?: string;
};

const CopyableSecret: FunctionComponent<CopyableSecretProps> = ({ value, label = "Secret" }) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error
        ? cause.message
        : String(cause));
    }
  };

  const onCopy = async () => {
    setCopied(false);
    setError("");
    await copy();
  };

  return (
    <>
      <div className={styles.secretField}>
        <input className={styles.maskedInput} type="text" aria-label={label} value={value} readOnly />
        <button className={`${styles.buttonSecondary} ${styles.copyButton}`} type="button" aria-label={copied ? "Copied" : "Copy token"} onClick={() => void onCopy()}>
          {copied
            ? <Check className={styles.copyIcon} aria-hidden="true" />
            : <Copy className={styles.copyIcon} aria-hidden="true" />}
        </button>
      </div>
      {error && <p className={styles.formError} role="alert">{error}</p>}
    </>
  );
};

export default CopyableSecret;
