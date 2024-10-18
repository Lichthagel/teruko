export const CREATE_IMAGE = `
mutation ($files: [Upload!]!) {
  createImage(files: $files) {
    id
  }
}
`;

export const TERUKO_BASE_URL = (() => {
  if (import.meta.env.VITE_TERUKO_BASE_URL) {
    return import.meta.env.VITE_TERUKO_BASE_URL as string;
  } else {
    throw new Error("VITE_TERUKO_BASE_URL is not defined");
  }
})();
