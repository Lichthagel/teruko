export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return;

  try {
    await $fetch("/auth/session");
  } catch (cause) {
    const statusCode = typeof cause === "object" && cause !== null && "statusCode" in cause
      ? cause.statusCode
      : undefined;
    if (statusCode !== 401)
      throw cause;

    return navigateTo(`/login?returnTo=${encodeURIComponent(to.fullPath)}`, { external: true });
  }
});
