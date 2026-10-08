import { execFileSync, spawn } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import path, { delimiter } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const workspacePath = fileURLToPath(new URL("../..", import.meta.url));
const pnpmShim = process.env.PATH?.split(delimiter).map(dir => path.join(dir, "pnpm")).find(existsSync);
if (!pnpmShim)
  throw new Error("pnpm executable not found on PATH");
const resolvedPnpm = realpathSync(pnpmShim);
const pnpmCli = [path.join(path.dirname(resolvedPnpm), "bin", "pnpm.mjs"), path.join(path.dirname(resolvedPnpm), "pnpm.mjs"), resolvedPnpm].find(candidate => existsSync(candidate) && /\.m?js$/.test(candidate));
if (!pnpmCli)
  throw new Error(`Cannot resolve pnpm JavaScript CLI from ${resolvedPnpm}`);

const apps = [
  {
    args: [".output/server/index.mjs"],
    command: process.execPath,
    cwd: "apps/web-nuxt",
    port: 3100,
  },
  {
    args: ["server.mjs"],
    command: process.execPath,
    cwd: "apps/web-solidstart",
    port: 3101,
  },
  {
    args: ["build/index.js"],
    command: process.execPath,
    cwd: "apps/web-svelte",
    port: 3102,
  },
  {
    args: [".output/server/index.mjs"],
    command: process.execPath,
    cwd: "apps/web-tanstack-react",
    port: 3103,
  },
] as const;

const run = (args: string[]) => {
  execFileSync(process.execPath, [pnpmCli, ...args], {
    cwd: workspacePath,
    stdio: "inherit",
  });
};

const waitForServer = async (port: number, server: ReturnType<typeof spawn>) => {
  const url = `http://127.0.0.1:${port}/`;
  const deadline = Date.now() + 180_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Server on port ${port} exited with code ${server.exitCode}`);
    }

    try {
      await fetch(url);
      return;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  throw new Error(`Timed out waiting for ${url}`);
};

const globalSetup = async () => {
  if (process.env.SKIP_E2E_DB_SETUP !== "1") {
    run(["--filter", "server-db", "exec", "drizzle-kit", "migrate"]);
    run(["--filter", "server-db", "run", "seed"]);
  }

  const servers = apps.map(({ args, command, cwd, port }) => {
    const server = spawn(command, args, {
      cwd: path.join(workspacePath, cwd),
      detached: true,
      env: {
        ...process.env,
        HOST: "127.0.0.1",
        NODE_ENV: "test",
        AUTH_TEST_BYPASS: "1",
        AUTH_TEST_ALLOW_BEARER: "1",
        IMG_FOLDER: process.env.IMG_FOLDER ?? path.join(workspacePath, "data"),
        NITRO_HOST: "127.0.0.1",
        PORT: String(port),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    server.stdout?.on("data", chunk => process.stdout.write(`[e2e:${port}] ${chunk}`));
    server.stderr?.on("data", chunk => process.stderr.write(`[e2e:${port}] ${chunk}`));
    return server;
  });

  try {
    await Promise.all(apps.map(({ port }, index) => waitForServer(port, servers[index]!)));
  } catch (error) {
    for (const server of servers) {
      server.kill();
    }
    throw error;
  }

  return async () => {
    for (const server of servers) {
      if (server.pid) {
        try {
          process.kill(-server.pid, "SIGTERM");
        } catch {
          server.kill();
        }
      }
    }
  };
};

export default globalSetup;
