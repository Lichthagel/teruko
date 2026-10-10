import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { requireSessionUser, userTokenStatus } from "server-auth/auth";

export const load: PageServerLoad = async ({ request, setHeaders }) => {
  const user = await requireSessionUser(request);
  if (!user) {
    redirect(302, `/login?returnTo=${encodeURIComponent("/settings/tokens")}`);
  }

  setHeaders({ "Cache-Control": "no-store" });
  return { status: await userTokenStatus(user) };
};
