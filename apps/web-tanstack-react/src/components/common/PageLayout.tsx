import type { FunctionComponent, ReactNode } from "react";
import styles from "client-css/m/form.module.scss";

type PageLayoutProps = {
  title: string;
  children: ReactNode;
};

const PageLayout: FunctionComponent<PageLayoutProps> = ({ title, children }) => (
  <main className={styles.page}>
    <h1 className={styles.pageTitle}>{title}</h1>
    {children}
  </main>
);

export default PageLayout;
