import type { NextRequest } from "next/server";

import fs from "node:fs/promises";
import path from "node:path";
import env from "server-env";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> },
): Promise<Response> {
  const params = await context.params;

  const filename = z.string().parse(params.filename);

  const filepath = path.join(env.IMG_FOLDER, filename);

  const file = await fs.readFile(filepath);

  return new Response(file);
}
