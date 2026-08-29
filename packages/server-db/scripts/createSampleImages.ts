import { Buffer } from "node:buffer";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

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

const images = Array.from({ length: 64 }, (_, i) => ({
  filename: `img_${String(i + 1).padStart(3, "0")}.jpg`,
  ...dimensions[i % dimensions.length],
}));

const createSampleImages = async () => {
  const folder = path.resolve(process.env.IMG_FOLDER ?? "./data");
  await fs.rm(folder, { recursive: true, force: true });
  await fs.mkdir(folder, { recursive: true });

  for (let i = 0; i < images.length; i++) {
    const { filename, w, h } = images[i];
    const filePath = path.join(folder, filename);

    console.log(`Downloading ${filename} (${w}x${h})...`);

    const url = `https://picsum.photos/${w}/${h}?seed=${i + 1}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`Failed to download ${url}: ${res.status}`);
      continue;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    console.log(`Saved ${filename} (${buffer.length} bytes)`);
  }

  console.log("Done.");
};

createSampleImages().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
