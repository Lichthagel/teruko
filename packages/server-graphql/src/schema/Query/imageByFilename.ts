import { inArray } from "drizzle-orm";
import {
  db,
  dImage,
} from "server-db";

import { builder } from "../builder.js";

import { PothosImage } from "../Image.js";

builder.queryField("imageByFilename", t =>
  t.field({
    type: PothosImage,
    nullable: true,
    args: {
      filename: t.arg.string({
        required: true,
      }),
    },
    resolve: async (parent, { filename }) => {
      const filenameAvif = `${filename.split(".")[0]}.avif`;

      const [image] = await db
        .select()
        .from(dImage)
        .where(inArray(dImage.filename, [filename, filenameAvif]))
        .limit(1);

      return image;
    },
  }));
