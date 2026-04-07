import type { FunctionComponent } from "react";
import { useFilters } from "#/stores/filters";
import styles from "client-css/m/tag.module.scss";
import { useCallback, useEffect, useState } from "react";
import Dialog from "../common/Dialog";
import TagEditSection from "./TagEditSection";

const TagDialog: FunctionComponent<{
  open?: boolean;
  setOpen?: (open: boolean) => void;
  slug: string;
}> = ({ open: openExt, setOpen: setOpenExt, slug }) => {
  const { setTags } = useFilters();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openExt != null) {
      // eslint-disable-next-line react/set-state-in-effect
      setOpen(openExt);
    }
  }, [openExt]);
  useEffect(() => {
    setOpenExt?.(open);
  }, [open, setOpenExt]);

  const afterUpdate = useCallback((newSlug?: string) => {
    setOpen(false);
    if (newSlug) {
      setTags((prev) => {
        const idx = prev.findIndex(el => el === slug);
        if (idx >= 0) {
          return prev.toSpliced(idx, 1, newSlug);
        }
        return prev;
      });
    }
  }, [setTags, slug]);

  return (
    <Dialog open={open} setOpen={setOpen} className={styles["tag-dialog"]}>
      <TagEditSection slug={slug} afterUpdate={afterUpdate} />
    </Dialog>
  );
};

export default TagDialog;
