import { parseEnv, z } from "bowlingx-znv";
import { config } from "dotenv";

config({
  path: "../../.env",
});

// eslint-disable-next-line n/no-process-env
const env = parseEnv(process.env, {
  DATABASE_URL: z.string().url(),
  IMG_FOLDER: z.string().default("./data"),
  NODE_ENV: z.string().default("production"),
});

export default env;
