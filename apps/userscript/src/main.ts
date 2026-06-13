import { defineActions } from "./components/Actions.jsx";
import { applyToAllConstantlyDebounced } from "./utils.js";

defineActions();

applyToAllConstantlyDebounced(
  el => el.querySelectorAll("div[role=presentation] > a.gtm-expand-full-size-illust"),
  (node) => {
    const linkUrl = (node as HTMLLinkElement).href;

    const existing = node.querySelector("teruko-actions");
    if (existing) {
      if (existing.url !== linkUrl) {
        existing.url = linkUrl;
      }
      return;
    }

    const actionsElement = document.createElement("teruko-actions");
    actionsElement.url = linkUrl;
    node.append(actionsElement);
  },
);
