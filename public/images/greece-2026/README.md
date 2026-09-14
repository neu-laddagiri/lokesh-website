# Greece 2026 photos

Drop the collages in this folder using the filenames below. The gallery reads
this directory at build time and renders only the files that exist, so there is
no code to change: add a file, redeploy, it appears. Captions and alt text are
already written in `src/lib/greece-2026.ts`.

Any of `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` works. Case does not matter.
Delete a file and its tile disappears.

## Athens

| Filename | Which collage |
| --- | --- |
| `athens-acropolis-parthenon` | Parthenon plus the Greek flag on the rock |
| `athens-acropolis-night` | Acropolis floodlit, three shots plus friends on Areopagus |
| `athens-hephaisteion-cats` | Two cats above the Temple of Hephaestus, with the street shots |
| `athens-lycabettus-dinner` | Rooftop dinner at night, the cat on the wall, city lights |
| `athens-monastiraki-views` | Alexander statue, Monastiraki, the wide Athens panorama |
| `athens-nightlife` | Little Kook, the group, the bottle shop |
| `athens-street-cats` | The 20-cat grid |
| `greece-food` | Souvlaki, gyros, pizza, the group dinners |

## Islands

| Filename | Which collage |
| --- | --- |
| `santorini-caldera-sunset` | Caldera sunset, Oia terraces, the moon over the water |
| `santorini-oia-night` | Oia after dark with the blue domes |
| `crete-seitan-limania` | Seitan Limania cove (the one with the gravestone joke) |
| `crete-elafonissi-beach` | Clear shallow water plus the name written in the sand |
| `crete-chania-harbor` | Chania harbor, the lighthouse, the old town street |

## Rome

| Filename | Which collage |
| --- | --- |
| `rome-colosseum` | Colosseum, three angles, plus the two of you on the wall |
| `rome-forum-vittoriano` | Roman Forum from above and the Altare della Patria |
| `rome-pantheon-navona-castel` | Pantheon, Piazza Navona, Castel Sant'Angelo |
| `rome-vatican-stpeters` | St. Peter's facade, the fountain, the colonnade |
| `rome-vatican-interior` | Inside St. Peter's |
| `rome-tiber-stpeters` | The Tiber, the street, the dome |
| `italy-food` | Cappuccino latte art, pasta, the toast |

## Sizing

These render at roughly 540px wide (wide tiles) or 270px (standard), and open
full size in the lightbox. Anything up to about 2000px on the long edge is
plenty. Next.js optimizes them on build.
