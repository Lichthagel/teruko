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
  OIDC_ISSUER_URL: v.optional(v.string()),
  OIDC_CLIENT_ID: v.optional(v.string()),
  OIDC_CLIENT_SECRET: v.optional(v.string()),
  AUTH_SESSION_SECRET: v.optional(v.string()),
  AUTH_BASE_URL: v.optional(v.string()),
});

type Env = Readonly<v.InferOutput<typeof Env>>;

const env: Env = v.parse(Env, process.env);

export default env;
