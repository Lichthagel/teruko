"use client";

import styles from "client-css/m/scrollbuttons.module.scss";
import clsx from "clsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollButtons = () => {
  const [showToTop, setShowToTop] = useState(false);
  const [showToBottom, setShowToBottom] = useState(false);

  const handleScroll = () => {
    setShowToTop(window.scrollY > 100);
    setShowToBottom(
      window.scrollY + window.innerHeight < document.body.scrollHeight - 100,
    );
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.buttons}>
      <button
        className={clsx(!showToTop && styles.hidden)}
        onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
        type="button"
      >
        <ChevronUp />
      </button>
      <button
        className={clsx(!showToBottom && styles.hidden)}
        onClick={() => {
          window.scrollTo({
            behavior: "smooth",
            top: globalThis.document.body.scrollHeight,
          });
        }}
        type="button"
      >
        <ChevronDown />
      </button>
    </div>
  );
};

export default ScrollButtons;
