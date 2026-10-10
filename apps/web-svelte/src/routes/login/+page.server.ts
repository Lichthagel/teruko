import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ url }) => ({
  returnTo: url.searchParams.get("returnTo") ?? "/",
});
