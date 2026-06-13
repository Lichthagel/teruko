import styles from "client-css/m/scrollbuttons.module.scss";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollButtons = () => {
  const [showToTop, setShowToTop] = useState(false);
  const [showToBottom, setShowToBottom] = useState(false);

  useEffect(() => {
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
    <div className={styles.buttons}>
      <button
        className={showToTop ? undefined : styles.hidden}
        onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
      >
        <ChevronUp />
      </button>
      <button
        className={showToBottom ? undefined : styles.hidden}
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
