import styles from "client-css/m/nav.module.scss";
import { Plus } from "lucide-react";

const Nav = () => {
  return (
    <div className={styles.bar}>
      <div className={`container ${styles.content}`}>
        <div className={styles.left}>
          <a className={styles.button} href="/">てる子</a>
        </div>
        <div>
          <a className={`${styles.button} ${styles.square}`} href="/new">
            <Plus />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Nav;
