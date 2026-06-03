// One-off: produce clean, web-optimized, semantically-named copies of the
// raw homepage photos. Originals are left untouched. Run: node scripts/optimize-homepage-media.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, "..", "public", "images", "homepage");

/** [source, output, maxWidth, quality] */
const JOBS = [
  ["sharjah.jpg",             "venue-sharjah.jpg",     2000, 72],
  ["4937201.jpg",             "club-wall-group.jpg",   1600, 78],
  ["4926097.jpeg",            "award-ceremony.jpg",    1600, 78],
  ["99z04gje1k810jtpd.jpeg",  "tournament-clock.jpg",  1400, 80],
];

for (const [src, out, w, q] of JOBS) {
  const meta = await sharp(join(DIR, src)).metadata();
  await sharp(join(DIR, src))
    .rotate()
    .resize({ width: Math.min(w, meta.width ?? w), withoutEnlargement: true })
    .jpeg({ quality: q, mozjpeg: true, progressive: true })
    .toFile(join(DIR, out));
  const after = await sharp(join(DIR, out)).metadata();
  console.log(`${src} (${meta.width}x${meta.height}) -> ${out} (${after.width}x${after.height})`);
}
console.log("done");
