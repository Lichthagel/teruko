import { ensureDatabaseReady } from "server-db";

export const init = async () => {
  await ensureDatabaseReady();
};
