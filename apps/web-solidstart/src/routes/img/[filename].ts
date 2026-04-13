import type { APIEvent } from "@solidjs/start/server";
import { createReadStream } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import env from "server-env";
import * as v from "valibot";

export const GET = async ({ params }: APIEvent): Promise<Response> => {
  const { filename } = v.parse(v.object({ filename: v.string() }), params);
  const filePath = path.join(env.IMG_FOLDER, filename);

  const file = Readable.toWeb(createReadStream(filePath)) as ReadableStream;

  const response = new Response(file, {
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });

  return response;
};
