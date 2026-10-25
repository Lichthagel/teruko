import { A } from "@solidjs/router";
import styles from "client-css/m/nav.module.scss";
import { Plus, User } from "lucide-solid";

const Nav = () => {
  return (
    <div class={styles.bar}>
      <div class={`container ${styles.content}`}>
        <div class={styles.left}>
          <A class={styles.button} href="/">てる子</A>
        </div>
        <div>
          <A class={`${styles.button} ${styles.square}`} href="/account" aria-label="Account" title="Account">
            <User size={20} />
          </A>
          <A class={`${styles.button} ${styles.square}`} href="/new">
            <Plus />
          </A>
        </div>
      </div>
    </div>
  );
};

export default Nav;
