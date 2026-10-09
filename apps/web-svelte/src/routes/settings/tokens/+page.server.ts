import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { requireUser, userTokenStatus } from "server-graphql";

export const load: PageServerLoad = async ({ request, setHeaders }) => {
  const user = await requireUser(request);
  if (!user) {
    redirect(302, `/login?returnTo=${encodeURIComponent("/settings/tokens")}`);
  }

  setHeaders({ "Cache-Control": "no-store" });
  return { status: await userTokenStatus(user) };
};
