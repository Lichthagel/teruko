/* eslint-disable n/no-process-env */
import { config } from "dotenv";
import { parseEnv, z } from "znv";

config({
  path: "../../.env",
});

const env: Readonly<{
  DATABASE_URL: string;
  IMG_FOLDER: string;
  NODE_ENV: string;
}> = parseEnv(process.env, {
  DATABASE_URL: z
    .string()
    .url()
    .default("file:./local.db"),
  IMG_FOLDER: z.string().default("./data"),
  NODE_ENV: z.string().default("production"),
});

export default env;
