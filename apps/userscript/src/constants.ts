export const CREATE_IMAGE = `
mutation ($files: [Upload!]!) {
  createImage(files: $files) {
    id
  }
}
`;

export const TERUKO_BASE_URL = import.meta.env.VITE_TERUKO_BASE_URL as string;
