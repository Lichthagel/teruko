import { A } from "@solidjs/router";
import styles from "client-css/m/nav.module.scss";
import { Plus } from "lucide-solid";

const Nav = () => {
  return (
    <div class={styles.bar}>
      <div class={`container ${styles.content}`}>
        <div class={styles.left}>
          <A class={styles.button} href="/">てる子</A>
        </div>
        <div>
          <A class={`${styles.button} ${styles.square}`} href="/new">
            <Plus />
          </A>
        </div>
      </div>
    </div>
  );
};

export default Nav;
