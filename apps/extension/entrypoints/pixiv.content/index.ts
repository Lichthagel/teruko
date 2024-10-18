import { applyToAllConstantlyDebounced } from "@/assets/utils";

import { defineDownloadButton } from "./DownloadButton";

export default defineContentScript({
  matches: ["*://www.pixiv.net/*"],
  world: "MAIN", // TODO does this need to be MAIN?
  main: () => {
    defineDownloadButton();

    applyToAllConstantlyDebounced(
      (el) => el.querySelectorAll("div[role=presentation] > a.gtm-expand-full-size-illust"),
      (node) => {
        if (node.querySelector("teruko-download-button")) {
          return;
        }

        const dlButton = document.createElement("teruko-download-button");

        dlButton.url = (node as HTMLLinkElement).href;

        node.append(dlButton);
      },
    );
  },
});
