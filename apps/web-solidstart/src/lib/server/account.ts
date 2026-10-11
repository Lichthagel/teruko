"use server";

import { authorizeRequest, isSameOriginRequest, requireSessionUser, resetUserToken, userTokenStatus } from "server-auth/auth";
import { getRequestEvent } from "solid-js/web";

export type TokenStatus = { active: boolean; createdAt: string | null };

export const getAccountTokenStatus = async () => {
  const event = getRequestEvent();
  const user = event ? await authorizeRequest(event.request) : null;
  if (!user)
    return { unauthorized: true as const };
  return { unauthorized: false as const, status: await userTokenStatus(user) };
};

export const createAccountToken = async () => {
  const event = getRequestEvent();
  const request = event?.request;
  const user = request ? await requireSessionUser(request) : null;
  if (!request || !user)
    return { unauthorized: true as const };
  const origin = request.headers.get("origin");
  if (!origin || !isSameOriginRequest(request, origin))
    return { error: "Forbidden" as const };
  return { token: (await resetUserToken(user)).token };
};
