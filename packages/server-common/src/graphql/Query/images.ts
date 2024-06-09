import { decodeBase64, encodeBase64 } from "@pothos/core";
import {
  type ResolveCursorConnectionArgs,
  resolveCursorConnection,
} from "@pothos/plugin-relay";
import {
  SQL, and, asc, desc, eq, gt, inArray, lt, or, sql,
} from "drizzle-orm";
import { GraphQLError, GraphQLResolveInfo, Kind } from "graphql";
import { ImageExt } from "models";
import { z } from "zod";

import {
  dImage,
  dTag,
  dTagCategory,
  // eslint-disable-next-line perfectionist/sort-named-imports
  d_ImageToTag,
  db,
} from "../../db/index.js";
import { PothosImage } from "../Image.js";
import { builder } from "../builder.js";

const shouldIncludeTags = (info: GraphQLResolveInfo) =>
  info.fieldNodes[0]?.selectionSet?.selections.some(
    (selection) =>
      selection.kind === Kind.FIELD &&
      selection.name.value === "edges" &&
      selection.selectionSet?.selections.some(
        (selection) =>
          selection.kind === Kind.FIELD &&
          selection.name.value === "node" &&
          selection.selectionSet?.selections.some(
            (selection) =>
              selection.kind === Kind.FIELD && selection.name.value === "tags",
          ),
      ),
  );

const parseCursor = (
  cursor: string,
): {
  date: Date;
  id: string;
} => {
  const match = /^(?<date>.+)-(?<id>.+)$/.exec(decodeBase64(cursor));

  if (!match || !match.groups) {
    throw new GraphQLError("Invalid cursor");
  }

  const { date, id } = match.groups;

  const dateParsed = z.coerce.date().safeParse(date);

  if (!dateParsed.success || !id) {
    throw new GraphQLError("Invalid cursor");
  }

  return {
    date: dateParsed.data,
    id,
  };
};

const images = (b: typeof builder) =>
  b.queryField("images", (t) =>
    t.connection({
      type: PothosImage,
      args: {
        tags: t.arg.stringList({
          required: false,
        }),
        random: t.arg.boolean({
          required: false,
        }),
      },
      resolve: (parent, args, context, info) =>
        resolveCursorConnection(
          {
            args,
            toCursor: (image) =>
              encodeBase64(`${image.createdAt.toISOString()}-${image.id}`),
          },
          async ({
            before,
            after,
            limit,
            inverted,
          }: ResolveCursorConnectionArgs) => {
            const conditions: (SQL | undefined)[] = [];

            const random = args.random ?? false;

            if (before && !random) {
              const { date, id } = parseCursor(before);

              conditions.push(
                or(
                  gt(dImage.createdAt, date),
                  and(eq(dImage.createdAt, date), gt(dImage.id, id)),
                ),
              );
            }

            if (after && !random) {
              const { date, id } = parseCursor(after);

              conditions.push(
                or(
                  lt(dImage.createdAt, date),
                  and(eq(dImage.createdAt, date), lt(dImage.id, id)),
                ),
              );
            }

            if (args.tags && args.tags.length > 0) {
              conditions.push(
                ...args.tags.map((tag) => {
                  const sq = db
                    .select({ id: d_ImageToTag.A })
                    .from(d_ImageToTag)
                    .where(eq(d_ImageToTag.B, tag));

                  return inArray(dImage.id, sq);
                }),
              );
            }

            const query = db
              .select()
              .from(dImage)
              .orderBy(
                ...(random ?
                    [sql`RANDOM()`] :
                    [inverted ? asc(dImage.createdAt) : desc(dImage.createdAt), asc(dImage.id)]),
              )
              .where(and(...conditions))
              .limit(limit)
              .as("Image");

            if (!shouldIncludeTags(info)) {
              const res = await db.select().from(query);

              return res.map((image) => ({
                ...image,
              }));
            }

            const res = await db
              .select()
              .from(query)
              .leftJoin(d_ImageToTag, eq(query.id, d_ImageToTag.A))
              .leftJoin(dTag, eq(d_ImageToTag.B, dTag.slug))
              .leftJoin(dTagCategory, eq(dTag.categorySlug, dTagCategory.slug))
              .orderBy(
                desc(dImage.createdAt),
                inverted ? asc(dImage.id) : desc(dImage.id),
                asc(dTag.categorySlug),
                asc(dTag.slug),
              );

            // Build object from the returned rows
            const reduced: ImageExt[] = [];

            for (const cur of res) {
              const last = reduced.at(-1);

              if (last === undefined || last.id !== cur.Image.id) {
                if (cur.Tag) {
                  reduced.push({
                    ...cur.Image,
                    tags: [
                      {
                        ...cur.Tag,
                        category: cur.TagCategory,
                      },
                    ],
                  });
                } else {
                  reduced.push({
                    ...cur.Image,
                    tags: [],
                  });
                }
              } else {
                const tags = last.tags ?? [];

                if (cur.Tag) {
                  tags.push({
                    ...cur.Tag,
                    category: cur.TagCategory,
                  });
                }
              }
            }

            return reduced;
          },
        ),
    }));

export default images;
