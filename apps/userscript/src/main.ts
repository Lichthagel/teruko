import newImage from "./newImage.js";
import "./style.css";
import { applyToAllConstantlyDebounced } from "./utils.js";

applyToAllConstantlyDebounced(
  (el) => el.querySelectorAll("div[role=presentation] > a.gtm-expand-full-size-illust"),
  (node) => {
    if (node.querySelector(".terukoButton")) {
      return;
    }

    const dlButton = document.createElement("div");
    dlButton.classList.add("terukoButton");
    dlButton.textContent = "teruko";
    dlButton.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      newImage(
        (node as HTMLLinkElement).href,
        event.shiftKey,
        event.target as HTMLDivElement,
      ).catch(console.error);
    });

    node.append(dlButton);
  },
);
