/**
 * One-off: rename the trip collages to their gallery slugs and re-encode them.
 *
 * The originals were 2160x3840 PNGs totalling ~138MB, which is far too heavy to
 * commit or ship. WebP at 1400px on the long edge keeps them sharp in the grid
 * and in the lightbox while cutting the folder to a few MB.
 *
 * Run from the repo root: node scripts/optimize-greece-photos.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "images", "greece-2026");
const MAX_EDGE = 1400;
const QUALITY = 82;

/** Identified by eye from the collages themselves. */
const RENAMES = {
  "acropolis (1).PNG": "athens-acropolis-parthenon",
  "IMG_3744.PNG": "athens-acropolis-night",
  "IMG_3752.PNG": "athens-hephaisteion-cats",
  "IMG_3697.PNG": "athens-lycabettus-dinner",
  "IMG_3795.PNG": "athens-monastiraki-views",
  "IMG_3725.PNG": "athens-nightlife",
  "IMG_3794.PNG": "athens-street-cats",
  "IMG_3758.PNG": "greece-food",
  "IMG_1497.JPEG": "santorini-caldera-sunset",
  "IMG_3456.PNG": "santorini-oia-night",
  "AF469730-578F-46FA-9C2A-94576256BD47.PNG": "crete-seitan-limania",
  "30603766-7B9B-4043-9176-E5235C18C665.PNG": "crete-elafonissi-beach",
  "IMG_3455.PNG": "crete-chania-harbor",
  "E00B1D03-817A-4653-8FA3-61AE60F66ECC.PNG": "rome-colosseum",
  "IMG_3589.PNG": "rome-forum-vittoriano",
  "IMG_3574.PNG": "rome-pantheon-navona-castel",
  "9DBF9974-38EA-43A6-A7DA-5DF50B1A6055.PNG": "rome-vatican-stpeters",
  "IMG_3526.PNG": "rome-vatican-interior",
  "44F98E35-02A3-4773-BA17-07348298FC4F.PNG": "rome-tiber-stpeters",
  "IMG_3602.PNG": "italy-food",
};

let before = 0;
let after = 0;
const dims = [];

for (const [original, slug] of Object.entries(RENAMES)) {
  const from = path.join(DIR, original);
  const to = path.join(DIR, `${slug}.webp`);
  try {
    const stat = await fs.stat(from);
    before += stat.size;
  } catch {
    console.log(`SKIP (missing): ${original}`);
    continue;
  }

  const image = sharp(from, { limitInputPixels: false });
  const meta = await image.metadata();
  await image
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(to);

  const out = await fs.stat(to);
  after += out.size;
  await fs.unlink(from);
  dims.push(`${slug}: ${meta.width}x${meta.height} -> ${(out.size / 1024).toFixed(0)}KB`);
}

for (const line of dims) console.log(line);
console.log(
  `\n${dims.length} files. ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`,
);
