import { defineActions } from "./components/Actions.jsx";
import { applyToAllConstantlyDebounced } from "./utils.js";

defineActions();

applyToAllConstantlyDebounced(
  el => el.querySelectorAll("div[role=presentation] > a.gtm-expand-full-size-illust"),
  (node) => {
    if (node.querySelector("teruko-actions")) {
      return;
    }

    const actionsElement = document.createElement("teruko-actions");
    actionsElement.url = (node as HTMLLinkElement).href;
    node.append(actionsElement);
  },
);
