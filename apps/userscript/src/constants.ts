import { createUrqlClient as createSharedUrqlClient } from "client-graphql";

export const CREATE_IMAGE = `
mutation ($files: [Upload!]!, $title: String, $source: String, $tags: [String!]) {
  createImage(files: $files, title: $title, source: $source, tags: $tags) {
    id
  }
}
`;

export const IMAGE_BY_FILENAME = `
query ImageByFilename($filename: String!) {
  imageByFilename(filename: $filename) {
    id
  }
}
`;

export const TERUKO_BASE_URL = import.meta.env.VITE_TERUKO_BASE_URL as string;

export const createUrqlClient = (url: string) => createSharedUrqlClient(url, {
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    const token = GM_getValue<string>("teruko_token", "");
    if (!token)
      throw new Error("Add a userscript token at Teruko settings first");
    const response = await new Promise<GmResponseEvent<"text", any>>((resolve, reject) => {
      GM_xmlhttpRequest({
        url: String(input),
        method: "POST",
        data: init?.body as FormData | string | undefined,
        headers: {
          ...Object.fromEntries(new Headers(init?.headers).entries()),
          Authorization: `Bearer ${token}`,
        },
        responseType: "text",
        onload: resolve,
        onerror: reject,
      });
    });
    const responseHeaders = new Headers();
    for (const header of response.responseHeaders.split(/\r?\n/)) {
      const separator = header.indexOf(":");
      if (separator > 0)
        responseHeaders.append(header.slice(0, separator).trim(), header.slice(separator + 1).trim());
    }
    return new Response(response.responseText, { status: response.status, headers: responseHeaders });
  },
});

export const setUserscriptToken = (token: string) => GM_setValue("teruko_token", token);
