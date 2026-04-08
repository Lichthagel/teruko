import type { DialogHTMLAttributes, FunctionComponent, ReactNode } from "react";
import styles from "client-css/m/dialog.module.scss";
import { useEffect, useRef, useState } from "react";

const Dialog: FunctionComponent<{
  children?: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  className?: string;
} & DialogHTMLAttributes<HTMLDialogElement>> = ({ children, open: openExt, setOpen: setOpenExt, className, ...restProps }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openExt) {
      // eslint-disable-next-line react/set-state-in-effect
      setOpen(openExt);
    }
  }, [openExt]);
  useEffect(() => {
    setOpenExt?.(open);
  }, [open, setOpenExt]);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogRef.current) {
      if (open) {
        dialogRef.current.showModal();
      } else {
        dialogRef.current.close();
      }
    }
  }, [open]);

  if (!open) {
    return;
  }

  return (
    <dialog ref={dialogRef} className={`${className ?? ""} ${styles.dialog}`} closedby="any" onClose={() => setOpen(false)} {...restProps}>
      {children}
    </dialog>
  );
};

export default Dialog;
