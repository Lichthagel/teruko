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

type GraphqlResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export const graphqlRequest = <T>(query: string, variables: Record<string, unknown> = {}) => {
  const token = GM_getValue<string>("teruko_token", "");
  if (!token)
    return Promise.reject(new Error("Add a userscript token at Teruko settings first"));

  return new Promise<GraphqlResponse<T>>((resolve, reject) => {
    GM_xmlhttpRequest({
      url: `${TERUKO_BASE_URL}/graphql`,
      method: "POST",
      data: JSON.stringify({ query, variables }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      responseType: "text",
      onload: (response) => {
        if (response.status < 200 || response.status >= 300) {
          reject(new Error(`GraphQL request failed with status ${response.status}`));
          return;
        }

        try {
          resolve(JSON.parse(response.responseText) as GraphqlResponse<T>);
        } catch (error) {
          reject(error);
        }
      },
      onerror: event => reject(event.error),
    });
  });
};

export const setUserscriptToken = (token: string) => GM_setValue("teruko_token", token);
