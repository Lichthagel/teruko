/* eslint-disable antfu/no-import-dist */
import process from "node:process";
import { d_ImageToTag, db, dImage, dTag, dTagCategory } from "../dist/index.js";

const dimensions = [
  { w: 1280, h: 720 },
  { w: 1920, h: 1080 },
  { w: 2560, h: 1440 },
  { w: 3840, h: 2160 },
  { w: 800, h: 1200 },
  { w: 1080, h: 1920 },
  { w: 1024, h: 1024 },
  { w: 800, h: 600 },
  { w: 1024, h: 768 },
];

const seed = async () => {
  console.log("Seeding TagCategory...");

  await db.insert(dTagCategory).values([
    { slug: "artist", color: "#ff6b6b" },
    { slug: "series", color: "#4ecdc4" },
    { slug: "general", color: "#95e1d3" },
  ]).onConflictDoNothing();

  console.log("Seeding Tag...");

  await db.insert(dTag).overridingSystemValue().values([
    { id: 1, slug: "landscape", categorySlug: "general", approved: true },
    { id: 2, slug: "portrait", categorySlug: "general", approved: true },
    { id: 3, slug: "anime", categorySlug: "series", approved: true },
    { id: 4, slug: "nature", categorySlug: "general", approved: true },
    { id: 5, slug: "cityscape", categorySlug: "general", approved: true },
    { id: 6, slug: "abstract", categorySlug: "general", approved: true },
    { id: 7, slug: "rei-ayanami", categorySlug: "artist", approved: true },
    { id: 8, slug: "sunset", categorySlug: "general", approved: false },
  ]).onConflictDoNothing();

  console.log("Seeding Image...");

  const imageEntries = Array.from({ length: 64 }, (_, i) => ({
    id: i + 1,
    filename: `img_${String(i + 1).padStart(3, "0")}.jpg`,
    title: `Sample Image ${i + 1}`,
    source: i % 4 === 0 ? `https://example.com/image/${i + 1}` : null,
    width: dimensions[i % dimensions.length].w,
    height: dimensions[i % dimensions.length].h,
  }));

  await db.insert(dImage).overridingSystemValue().values(imageEntries).onConflictDoNothing();

  console.log("Seeding _ImageToTag...");

  const joinEntries = imageEntries.flatMap(img => (
    [
      { imageId: img.id, tagId: (img.id * 3) % 8 + 1 },
      { imageId: img.id, tagId: (img.id * 3 + 1) % 8 + 1 },
    ]
  ));

  await db.insert(d_ImageToTag).values(joinEntries).onConflictDoNothing();

  console.log("Seed complete.");
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
