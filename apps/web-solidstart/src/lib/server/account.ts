"use server";

import { authorizeRequest, isSameOriginRequest, requireSessionUser, resetUserToken } from "server-auth/auth";
import { getRequestEvent } from "solid-js/web";

export const hasAccountAccess = async () => {
  const event = getRequestEvent();
  return Boolean(event && await authorizeRequest(event.request));
};

export const createAccountToken = async () => {
  const event = getRequestEvent();
  const request = event?.request;
  const user = request
    ? await requireSessionUser(request)
    : null;
  if (!request || !user)
    return { unauthorized: true as const };
  const origin = request.headers.get("origin");
  if (!origin || !isSameOriginRequest(request, origin))
    return { error: "Forbidden" as const };
  return { token: (await resetUserToken(user)).token };
};
