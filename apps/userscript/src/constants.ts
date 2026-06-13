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
export const TERUKO_BASIC_AUTH = import.meta.env.VITE_TERUKO_BASIC_AUTH as string | undefined;
