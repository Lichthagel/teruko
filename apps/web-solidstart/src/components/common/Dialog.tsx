import type { Component, JSX } from "solid-js";
import styles from "client-css/m/dialog.module.scss";
import { children, createComputed, createEffect, createSignal, Show, splitProps } from "solid-js";

const Dialog: Component<{
  children?: JSX.Element;
  open?: boolean;
  setOpen?: (value: boolean) => void;
} & JSX.DialogHtmlAttributes<HTMLDialogElement>> = (props_) => {
  const [props, restProps] = splitProps(props_, ["children", "open", "setOpen", "class"]);
  const safeChildren = children(() => props.children);

  const [open, setOpen] = createSignal(false);
  createComputed(() => {
    if (props.open != null) {
      setOpen(props.open);
    }
  });
  createComputed(() => {
    props.setOpen?.(open());
  });

  const [dialogRef, setDialogRef] = createSignal<HTMLDialogElement>();
  createEffect(() => {
    if (open()) {
      dialogRef()?.showModal();
    } else {
      dialogRef()?.close();
    }
  });

  return (
    <Show when={open}>
      <dialog class={`${props.class} ${styles.dialog}`} ref={setDialogRef} closedby="any" onClose={() => setOpen(false)} {...restProps}>
        {safeChildren()}
      </dialog>
    </Show>
  );
};

export default Dialog;
