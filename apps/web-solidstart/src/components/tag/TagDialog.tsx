import type { Component } from "solid-js";
import styles from "client-css/m/tag.module.scss";
import { createComputed, createSignal } from "solid-js";
import { setTags } from "~/utils/filters";
import Dialog from "../common/Dialog";
import TagEditSection from "./TagEditSection";

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

  const afterUpdate = (newSlug?: string) => {
    setOpen(false);
    if (newSlug) {
      // eslint-disable-next-line solid/reactivity
      setTags((prev) => {
        const idx = prev.findIndex(el => el === props.slug);
        if (idx >= 0) {
          return prev.toSpliced(idx, 1, newSlug);
        }
        return prev;
      });
    }
  };

  return (
    <Dialog open={open()} setOpen={setOpen} class={styles["tag-dialog"]}>
      <TagEditSection slug={props.slug} afterUpdate={afterUpdate} />
    </Dialog>
  );
};

export default TagDialog;
