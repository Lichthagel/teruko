import type { NextRequest } from "next/server";

import fs from "node:fs/promises";
import path from "node:path";
import env from "server-env";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  context: { params: { filename: string } },
): Promise<Response> {
  const filename = z.string().parse(context.params.filename);

  const filepath = path.join(env.IMG_FOLDER, filename);

  const file = await fs.readFile(filepath);

  return new Response(file);
}
