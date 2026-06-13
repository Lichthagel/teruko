import { GM_xmlhttpRequest } from "$";

export const applyToAllConstantlyDebounced = (
  selector: (el: Element) => NodeListOf<Element>,
  callback: (el: Element) => void,
  container: Element = document.body,
  delay = 50,
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const observer = new MutationObserver(() => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      const elements = selector(container);

      elements.forEach((el) => {
        callback(el);
      });
    }, delay);
  });

  observer.observe(container, { childList: true, subtree: true });
};

export const GMfetch = (url: string, options: Omit<GmXmlhttpRequestOption<"text", any>, "url" | "onload" | "onerror ">) => {
  return new Promise<GmResponseEvent<"text", any>>((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method: "GET",
      onload(res) {
        resolve(res);
      },
      onerror(event) {
        reject(event.error);
      },
      ...options,
    });
  });
};
