/* eslint-disable n/no-process-env */
import { config } from "dotenv";
import z from "zod";

config({
  path: "../../.env",
});

const Env = z.object({
  DATABASE_URL: z
    .string()
    .default("file:./local.db"),
  IMG_FOLDER: z.string().default("./data"),
  NODE_ENV: z.string().default("production"),
});

type Env = Readonly<z.infer<typeof Env>>;

const env: Env = Env.parse(process.env);

export default env;
