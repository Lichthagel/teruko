import type { Component } from "solid-js";
import styles from "client-css/m/tag.module.scss";
import { createComputed, createSignal } from "solid-js";
import Dialog from "../common/Dialog";

const TagDialog: Component<{
  open?: boolean;
  setOpen?: (value: boolean) => void;
  slug: string;
}> = (props) => {
  const [open, setOpen] = createSignal(false);
  createComputed(() => {
    if (props.open != null) {
      setOpen(props.open);
    }
  });
  createComputed(() => {
    props.setOpen?.(open());
  });

  return (
    <Dialog open={open()} setOpen={setOpen} class={styles["tag-dialog"]}>
      {/* <TagEditSection {slug} onSubmit={onSubmit} /> */}
      hello
      {" "}
      {props.slug}
    </Dialog>
  );
};

export default TagDialog;
