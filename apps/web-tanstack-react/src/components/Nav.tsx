import { Link } from "@tanstack/react-router";
import styles from "client-css/m/nav.module.scss";
import { Plus } from "lucide-react";

const Nav = () => {
  return (
    <div className={styles.bar}>
      <div className={`container ${styles.content}`}>
        <div className={styles.left}>
          <Link className={styles.button} to="/">てる子</Link>
        </div>
        <div>
          {/* @ts-expect-error not yet implemented */}
          <Link className={`${styles.button} ${styles.square}`} to="/new">
            <Plus />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Nav;
