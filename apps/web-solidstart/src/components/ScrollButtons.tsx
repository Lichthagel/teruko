import styles from "client-css/m/scrollbuttons.module.scss";
import { ChevronDown, ChevronUp } from "lucide-solid";
import { createEffect, createSignal } from "solid-js";

const ScrollButtons = () => {
  const [showToTop, setShowToTop] = createSignal();
  const [showToBottom, setShowToBottom] = createSignal();

  createEffect(() => {
    const onScroll = () => {
      setShowToTop(window.scrollY > 50);
      setShowToBottom(window.scrollY + window.innerHeight < globalThis.document.body.scrollHeight - 50);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  return (
    <div class={styles.buttons}>
      <button
        class={showToTop() ? undefined : styles.hidden}
        onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
      >
        <ChevronUp />
      </button>
      <button
        class={showToBottom() ? undefined : styles.hidden}
        onClick={() => {
          window.scrollTo({
            behavior: "smooth",
            top: globalThis.document.body.scrollHeight,
          });
        }}
      >
        <ChevronDown />
      </button>
    </div>
  );
};

export default ScrollButtons;
