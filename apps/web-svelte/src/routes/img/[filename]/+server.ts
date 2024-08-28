import type { RequestHandler } from "@sveltejs/kit";

import fs from "node:fs/promises";
import path from "node:path";
import env from "server-env";

export const GET = (async ({ params }): Promise<Response> => {
  const filePath = path.join(env.IMG_FOLDER, params.filename);

  const file = await fs.readFile(filePath);

  const response = new Response(file, {
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });

  return response;
}) satisfies RequestHandler<{
  filename: string;
}>;
