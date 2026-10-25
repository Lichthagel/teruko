import type { Component } from "solid-js";
import styles from "client-css/m/form.module.scss";
import { Check, Copy } from "lucide-solid";
import { createEffect, createMemo, createSignal, Show } from "solid-js";

const CopyableSecret: Component<{ value: string; label?: string }> = (props) => {
  const [copied, setCopied] = createSignal(false);
  const [error, setError] = createSignal("");
  const value = createMemo(() => props.value);

  createEffect(() => {
    value();
    setCopied(false);
    setError("");
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value());
      setCopied(true);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error
        ? cause.message
        : String(cause));
    }
  };

  return (
    <>
      <div class={styles.secretField}>
        <input class={styles.maskedInput} type="text" aria-label={props.label ?? "Secret"} value={value()} readOnly />
        <button
          class={`${styles.buttonSecondary} ${styles.copyButton}`}
          type="button"
          aria-label={copied()
            ? "Copied"
            : "Copy token"}
          onClick={() => void copy()}
        >
          <Show when={copied()} fallback={<Copy class={styles.copyIcon} aria-hidden="true" />}>
            <Check class={styles.copyIcon} aria-hidden="true" />
          </Show>
        </button>
      </div>
      <Show when={error()}><p class={styles.formError} role="alert">{error()}</p></Show>
    </>
  );
};

export default CopyableSecret;
