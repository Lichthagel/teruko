/* eslint-disable promise/prefer-await-to-then */
import newImage from "./newImage.js";
import "./style.css";

let timeout: number | undefined;

const observer = new MutationObserver(() => {
  window.clearTimeout(timeout);

  timeout = window.setTimeout(() => {
    document
      .querySelectorAll(
        "div[role=presentation] > a.gtm-expand-full-size-illust"
      )
      // eslint-disable-next-line unicorn/no-array-for-each
      .forEach((node) => {
        if (node.querySelector(".terukoButton")) return;

        // const img = node.querySelector("img");

        // if(!img) return;

        const dlButton = document.createElement("div");
        dlButton.classList.add("terukoButton");
        dlButton.textContent = "teruko";
        dlButton.addEventListener("click", (event) => {
          event.stopPropagation();
          event.preventDefault();
          newImage(
            (node as HTMLLinkElement).href,
            event.shiftKey,
            event.target as HTMLDivElement
          ).catch(console.error);
        });

        node.append(dlButton);

        console.log("added button");
      });
  }, 20);
});

observer.observe(document.body, { childList: true, subtree: true });
