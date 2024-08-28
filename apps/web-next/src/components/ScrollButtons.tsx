"use client";

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
    <div className="join fixed bottom-3 right-3 z-10 bg-base-100">
      <button
        className={clsx("btn btn-square btn-ghost", { hidden: !showToTop })}
        onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
        type="button"
      >
        <ChevronUp />
      </button>
      <button
        className={clsx("btn btn-square btn-ghost", { hidden: !showToBottom })}
        onClick={() => {
          window.scrollTo({
            behavior: "smooth",
            top: window.document.body.scrollHeight,
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
