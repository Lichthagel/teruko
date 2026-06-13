import type { LucideIcon } from "lucide-solid";
import type { Component, JSX } from "solid-js";
import styles from "client-css/m/select.module.scss";
import { For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

const Select: Component<{
  icon?: LucideIcon;
  options: (string | { value: string; label: string })[];
  value?: string;
  setValue?: (value: string) => void;
}> = (props) => {
  const handleInput: JSX.InputEventHandler<HTMLSelectElement, InputEvent> = (event) => {
    event.preventDefault();

    props.setValue?.(event.currentTarget.value);
  };

  return (
    <div class={styles.select}>
      <Show when={props.icon}>
        <Dynamic component={props.icon} class={styles.icon} />
      </Show>

      <select value={props.value} onInput={handleInput}>
        <For each={props.options}>
          {option => (
            <option value={typeof option === "string" ? option : option.value}>
              {typeof option === "string" ? option : option.label}
            </option>
          )}
        </For>
      </select>
    </div>
  );
};

export default Select;
