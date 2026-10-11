import { GM_xmlhttpRequest } from "$";
import { TERUKO_BASE_URL } from "./constants.js";

type GraphqlResponse<T> = {
  data?: T | null;
  errors?: { message: string }[];
};

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

export const GMfetch = (url: string, options: Omit<GmXmlhttpRequestOption<"text", any>, "url" | "onload" | "onerror">) => {
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

export const GMgraphql = async <T>(body: string | FormData, token: string) => {
  const res = await GMfetch(`${TERUKO_BASE_URL}/graphql`, {
    method: "POST",
    data: body,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(typeof body === "string" ? { "Content-Type": "application/json" } : {}),
    },
  });

  return { res, response: JSON.parse(res.responseText) as GraphqlResponse<T> };
};
