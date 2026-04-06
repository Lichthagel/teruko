import type { FunctionComponent } from "react";
import styles from "client-css/m/tag.module.scss";
import { useEffect, useState } from "react";
import Dialog from "../common/Dialog";

const TagDialog: FunctionComponent<{
  open?: boolean;
  setOpen?: (open: boolean) => void;
  slug: string;
}> = ({ open: openExt, setOpen: setOpenExt, slug }) => {
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

  return (
    <Dialog open={open} setOpen={setOpen} className={styles["tag-dialog"]}>
      {/* <TagEditSection {slug} onSubmit={onSubmit} /> */}
      hello
      {" "}
      {slug}
    </Dialog>
  );
};

export default TagDialog;
