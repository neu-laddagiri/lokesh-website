# Greece 2026 photos

All 20 trip collages are in place, named for their gallery slug. The gallery
(`src/components/greece-2026/greece-gallery.tsx`) reads this directory at build
time and renders only the manifest entries whose file exists, so:

- Adding a photo: drop it in with a slug from `galleryEntries` in
  `src/lib/greece-2026.ts` and redeploy. No code change.
- Removing one: delete the file. Its tile disappears.
- Any of `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` works, case insensitive.

Captions and alt text live with the manifest, not the filenames.

## Encoding

Originals were 2160x3840 PNGs totalling 135MB, which is too heavy to commit or
ship. `scripts/optimize-greece-photos.mjs` re-encoded them to WebP at 1400px on
the long edge, quality 82: 135MB down to 4.2MB with no visible loss at the sizes
the page uses. Run that script again if you add more full-resolution exports.

The collages are 9:16, and the grid tiles match that ratio so nothing is
cropped.
