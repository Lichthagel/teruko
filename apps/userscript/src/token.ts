const KEY_TERUKO_TOKEN = "teruko_token";

export const requireToken = () => {
  let token = getToken();
  if (!token) {
    token = window.prompt("Create a token from Teruko Account settings and paste it here") ?? ""; // eslint-disable-line no-alert
  }
  if (!token) {
    throw new Error("A Teruko token is required");
  }
  setToken(token);
  return token;
};

export const getToken = () => GM_getValue<string>(KEY_TERUKO_TOKEN, "");

export const setToken = (token: string) => {
  GM_setValue(KEY_TERUKO_TOKEN, token);
};

export const clearToken = () => {
  GM_setValue(KEY_TERUKO_TOKEN, "");
};
