import { defineDownloadButton } from "./DownloadButton.jsx";
import { applyToAllConstantlyDebounced } from "./utils.js";

defineDownloadButton();

applyToAllConstantlyDebounced(
  el => el.querySelectorAll("div[role=presentation] > a.gtm-expand-full-size-illust"),
  (node) => {
    const linkUrl = (node as HTMLLinkElement).href;

    const existing = node.querySelector("teruko-download-button");
    if (existing) {
      if (existing.url !== linkUrl) {
        existing.url = linkUrl;
      }
      return;
    }

    const dlButton = document.createElement("teruko-download-button");
    dlButton.url = linkUrl;

    node.append(dlButton);
  },
);
