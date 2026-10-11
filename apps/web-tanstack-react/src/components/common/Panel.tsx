import type { FunctionComponent, ReactNode } from "react";
import styles from "client-css/m/form.module.scss";

type PanelProps = {
  id: string;
  title: string;
  children: ReactNode;
};

const Panel: FunctionComponent<PanelProps> = ({ id, title, children }) => (
  <section className={styles.panel} aria-labelledby={id}>
    <h2 id={id} className={styles.panelTitle}>{title}</h2>
    {children}
  </section>
);

export default Panel;
