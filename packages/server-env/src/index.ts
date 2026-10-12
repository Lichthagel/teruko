import process from "node:process";
import { config } from "dotenv";
import * as v from "valibot";

config({
  path: "../../.env",
});

const Env = v.object({
  DATABASE_URL: v.optional(
    v.string(),
    "postgresql://postgres:postgres@localhost:5432/postgres",
  ),
  IMG_FOLDER: v.optional(v.string(), "./data"),
  NODE_ENV: v.optional(v.string(), "production"),
});

type Env = Readonly<v.InferOutput<typeof Env>>;

const env: Env = v.parse(Env, process.env);

export default env;
