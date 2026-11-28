import { Buffer } from "node:buffer";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import env from "server-env";
import sharp from "sharp";

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

const colors = [
  "#1d3557",
  "#e76f51",
  "#2a9d8f",
  "#6d597a",
  "#e9c46a",
  "#457b9d",
];

const createSampleSvg = (width: number, height: number, index: number) => {
  const primary = colors[index % colors.length]!;
  const secondary = colors[(index + 3) % colors.length]!;
  const radius = Math.round(Math.min(width, height) * 0.22);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="${primary}" />
        <stop offset="1" stop-color="${secondary}" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#background)" />
    <circle cx="${width * 0.72}" cy="${height * 0.36}" r="${radius}" fill="#ffffff" fill-opacity="0.2" />
    <path d="M0 ${height * 0.78} Q${width * 0.24} ${height * 0.48} ${width * 0.5} ${height * 0.78} T${width} ${height * 0.78} V${height} H0 Z" fill="#0b132b" fill-opacity="0.32" />
    <path d="M0 ${height * 0.9} Q${width * 0.32} ${height * 0.62} ${width * 0.58} ${height * 0.88} T${width} ${height * 0.73} V${height} H0 Z" fill="#ffffff" fill-opacity="0.15" />
  </svg>`;
};

const createSampleImages = async () => {
  const folder = path.resolve(env.IMG_FOLDER);
  await fs.rm(folder, { recursive: true, force: true });
  await fs.mkdir(folder, { recursive: true });

  for (let i = 0; i < images.length; i++) {
    const { filename, w, h } = images[i];
    const filePath = path.join(folder, filename);

    console.log(`Generating ${filename} (${w}x${h})...`);

    const { size } = await sharp(Buffer.from(createSampleSvg(w, h, i)))
      .jpeg({ quality: 80 })
      .toFile(filePath);

    console.log(`Saved ${filename} (${size} bytes)`);
  }

  console.log("Done.");
};

createSampleImages().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
