export const clearRejectedUserscriptToken = (token: string) => {
  if (GM_getValue<string>("teruko_token", "") === token)
    GM_setValue("teruko_token", "");
};
