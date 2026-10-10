import type { NitroAppPlugin } from "nitro";
import { ensureDatabaseReady } from "server-db";

// eslint-disable-next-line antfu/no-top-level-await
await ensureDatabaseReady();

const databasePlugin: NitroAppPlugin = () => {};

export default databasePlugin;
