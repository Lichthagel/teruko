export const seededImage = {
  id: 6,
  filename: "img_006.jpg",
  title: "Sample Image 6",
  filterTag: "nature",
} as const;

export const notFoundText: Record<string, string | null> = {
  "web-nuxt": "Not Found",
  "web-svelte": "Not Found",
  "web-tanstack-react": "missing",
  "web-solidstart": null,
};
