// @ts-nocheck Generated SolidStart output does not expose a type declaration.
/* eslint-disable antfu/no-import-dist */
import { Buffer } from "node:buffer";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import process from "node:process";
import { Readable } from "node:stream";
import handler from "./dist/server/entry-server.js";

const port = Number(process.env.PORT ?? 3000);
const clientRoot = path.resolve("dist/client");
const contentTypes = {
  ".css": "text/css",
  ".gif": "image/gif",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? `localhost:${port}`}`);
    const method = request.method ?? "GET";

    if (method === "GET" && url.pathname.startsWith("/_build/")) {
      const filePath = path.resolve(clientRoot, `.${url.pathname}`);
      if (filePath.startsWith(`${clientRoot}${path.sep}`)) {
        try {
          const file = await stat(filePath);
          if (file.isFile()) {
            response.setHeader("Content-Type", contentTypes[path.extname(filePath)] ?? "application/octet-stream");
            response.end(await readFile(filePath));
            return;
          }
        } catch {
          // Let the application handler produce the response for missing assets.
        }
      }
    }

    const body = method === "GET" || method === "HEAD" ? undefined : Readable.toWeb(request);
    const webRequest = new Request(url, {
      body,
      duplex: "half",
      headers: request.headers,
      method,
    });
    const webResponse = await handler.fetch(webRequest);

    webResponse.headers.forEach((value, key) => response.setHeader(key, value));
    response.writeHead(webResponse.status);

    response.end(Buffer.from(await webResponse.arrayBuffer()));
  } catch (error) {
    response.statusCode = 500;
    response.end(error instanceof Error ? error.message : "Internal Server Error");
  }
});

server.listen(port, "0.0.0.0", () => {
  process.stdout.write(`Listening on http://0.0.0.0:${port}\n`);
});
