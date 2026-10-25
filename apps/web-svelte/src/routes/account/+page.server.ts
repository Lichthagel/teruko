import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { isSameOriginRequest, requireSessionUser, resetUserToken } from "server-auth/auth";

export const load: PageServerLoad = async ({ request, setHeaders }) => {
  const user = await requireSessionUser(request);
  if (!user) {
    redirect(302, `/login?returnTo=${encodeURIComponent("/account")}`);
  }

  setHeaders({ "Cache-Control": "no-store" });
  return {};
};

export const actions: Actions = {
  resetToken: async ({ request }) => {
    const origin = request.headers.get("origin");
    if (!origin || !isSameOriginRequest(request, origin))
      return fail(403, { error: "Forbidden" });

    const user = await requireSessionUser(request);
    if (!user)
      redirect(303, `/login?returnTo=${encodeURIComponent("/account")}`);

    const { token } = await resetUserToken(user);
    return { token };
  },
};
