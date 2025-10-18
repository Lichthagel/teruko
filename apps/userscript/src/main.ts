import { defineDownloadButton } from "./DownloadButton.jsx";
import { applyToAllConstantlyDebounced } from "./utils.js";

defineDownloadButton();

applyToAllConstantlyDebounced(
  el => el.querySelectorAll("div[role=presentation] > a.gtm-expand-full-size-illust"),
  (node) => {
    if (node.querySelector("teruko-download-button")) {
      return;
    }

    const dlButton = document.createElement("teruko-download-button");

    dlButton.url = (node as HTMLLinkElement).href;

    node.append(dlButton);
  },
);
