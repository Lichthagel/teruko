import styles from "client-css/m/nav.module.scss";
import clsx from "clsx";
import { Plus } from "lucide-react";
import NextLink from "next/link";

const Nav: React.FC = () => (
  <nav className={styles.bar}>
    <div className={clsx("container", styles.content)}>
      <div className={styles.left}>
        <NextLink className={styles.button} href="/">
          てる子
        </NextLink>
      </div>
      <div>
        <NextLink className={clsx(styles.button, styles.square)} href="/new">
          <Plus />
        </NextLink>
      </div>
    </div>
  </nav>
);

export default Nav;
