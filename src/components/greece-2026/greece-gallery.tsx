import fs from "node:fs";
import path from "node:path";
import {
  galleryEntries,
  galleryGroups,
  type GalleryEntry,
  type GalleryGroupId,
} from "@/lib/greece-2026";
import { GreeceGalleryGrid, type ResolvedPhoto } from "./greece-gallery-grid";

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"] as const;
const PUBLIC_DIR = path.join(process.cwd(), "public", "images", "greece-2026");

/**
 * Matches each caption in the manifest to a file on disk, case insensitively
 * and regardless of extension. Entries without a file are skipped, so the
 * page never renders a broken image and photos can be added by drag and drop.
 */
function resolvePhotos(entries: readonly GalleryEntry[]): ResolvedPhoto[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(PUBLIC_DIR);
  } catch {
    return [];
  }

  const byBasename = new Map<string, string>();
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!EXTENSIONS.includes(ext as (typeof EXTENSIONS)[number])) continue;
    byBasename.set(path.basename(file, path.extname(file)).toLowerCase(), file);
  }

  const resolved: ResolvedPhoto[] = [];
  for (const entry of entries) {
    const file = byBasename.get(entry.slug.toLowerCase());
    if (!file) continue;
    resolved.push({
      slug: entry.slug,
      group: entry.group,
      alt: entry.alt,
      caption: entry.caption,
      wide: entry.wide ?? false,
      src: `/images/greece-2026/${file}`,
    });
  }
  return resolved;
}

export function GreeceGallery() {
  const photos = resolvePhotos(galleryEntries);
  if (photos.length === 0) return null;

  const present = new Set<GalleryGroupId>(photos.map((photo) => photo.group));
  const groups = galleryGroups.filter((group) => present.has(group.id));

  return <GreeceGalleryGrid photos={photos} groups={groups} />;
}
