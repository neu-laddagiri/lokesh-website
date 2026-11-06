# Co-op announcement intro: spec

## Goal
When someone opens lokeshaddagiri.com (first visit per browser session), a roughly 20-second full-screen intro tells the story of my fall 2026 co-op search and lands on a card announcing my Verisk co-op. It can be skipped at any moment, and skipping goes straight to the same final card. After the card is closed, a button near the top of the homepage reopens it.

## Data
Every number, date, organization, and map location comes from `coop-data.json` in this folder. Never round, inflate, hardcode different values, or invent numbers. Hide any stat whose value is `null` (right now that is `careerFairsAttended`).

## The core idea: one orchestrated moment
Each application is a dot: 132 dots, one per real application. The intro is the search compressing into one result.
- Dots appear while the application count rolls up.
- The 52 rejected or withdrawn dots dim.
- The 11 interview-invite dots glow.
- Everything else fades until one dot remains, and that dot becomes the map pin.
While the search plays, my organization logos orbit the dot field and tighten toward the center as the search narrows. Keep everything around this quiet: the dots-to-pin moment is the one bold thing.

## Scenes and timing (desktop, about 20 s total)
0. **Mount (0 to 0.6 s):** a full-viewport overlay above the page. The Skip intro button is visible from the first frame (top right), and Esc also skips.
1. **The search begins (0.6 to 4 s):** the line "Fall 2026. One co-op search." Then the organization logos and my project marks fly in from the edges and settle into a slow orbit.
2. **The numbers (4 to 9 s):** dots spawn as counters roll up, staggered, each with a plain label: 132 co-op applications, 80 companies, first application September 29, 128 applications in October, 127 tailored resumes, 53 people met along the way.
3. **The funnel (9 to 12 s):** 52 dots dim (rejected or withdrawn) and 11 glow (interview invites), each with its counter. The logo orbit tightens toward the center.
4. **The yes (12 to 14.5 s):** everything collapses to one dot, and a compact timeline unfolds from it, using `coop.timeline` from the data: Oct 11 applied, Oct 14 recorded interview and assessment, Nov 2 panel interview, Nov 2 offer, Nov 4 accepted.
5. **Athens to Boston (14.5 to 19 s):** the Greek flag appears (it ties to the Greece 2026 section of the site; reuse the existing flag and flight map components where they fit). Its nine stripes peel apart and stretch into a great-circle arc from Athens to Boston. The map follows the arc to Boston, zooms into Lafayette City Center, and drops a pin on the office. The camera then orbits the pin 360 degrees (bearing rotation over about 3 s, slight pitch).
6. **Landing (19 to 20.5 s):** the final card rises over the dimmed map, the overlay background fades, and the card stays.

**Mobile:** same story with at most 5 orbiting logos, a smaller dot field, a 180-degree orbit, and about 16 s total.

## Final card
Copy:
- Heading: "I'm joining Verisk this spring"
- Role: "Technology Services Group Co-op"
- Place and dates: "Boston, January 6 to June 25, 2027"
- One line: the `coop.summary` sentence from the data
- Up to four stats: 132 co-op applications, 11 interview invites, 22 days from application to offer, 1 yes
- The five-step timeline in compact form
- Buttons: "Replay intro" and "Close" (plus "View resume" if the site already has a resume link)

Behavior: a modal dialog (role="dialog", aria-modal="true") with a focus trap. Esc, the close button, and a backdrop click all close it, and focus returns to the reopen button.

## Reopen button
A small, persistent button near the top of the homepage (in the header or the hero) labeled "Co-op news." It opens the final card. Put it in the site header on every page if that fits the design.

## Playback rules
- Autoplay once per browser session on the homepage only (sessionStorage key `coopIntroSeen`).
- `?intro=1` forces a replay, and `?intro=0` suppresses it.
- `prefers-reduced-motion: reduce` skips the animation and shows the final card with a simple fade.
- Pause the timeline if the tab is hidden.
- Skip works at every moment and always lands on the final card. Never trap the visitor.

## Map
- MapLibre GL JS, dynamically imported. Start loading it during scene 2 so it's ready by scene 5.
- Tiles: OpenFreeMap or another keyless source. Keep the OpenStreetMap attribution visible during the map scene.
- The coordinates in the data are approximate. Verify the office location before shipping.
- Fallback: if WebGL is unavailable or tiles haven't loaded within 4 s, show a simple SVG illustration of Boston with the pin and continue the sequence.

## Assets
- All logos are already in `public/coop/logos/` as unedited originals: the organizations (filenames in `organizations`) plus my own project marks (`projects`: IG Wrapped, CardEdge, and my site icon), which can join the orbit. Every entry has a logo file; if one ever fails to load, fall back to a text badge with the organization's name. Optimize at build time (next/image or equivalent) so each loads at 50 KB or less.
- The Greek flag is a public-domain national flag. Draw it as SVG.
- Verisk appears as text only. Don't recreate, trace, or display the Verisk logo, and don't use the LinkedIn pumpkin video.

## Design
- Use the site's existing design system (type, colors, spacing) so the intro feels like part of the site, not a template and not an imitation of Verisk's branding.
- Avoid generic tells: no all-caps eyebrow labels, no meta strings joined with middle dots, no gradient washes, no fade-and-slide on everything.
- Plain, sentence-case copy where each label says exactly what the number is.

## Quality floor
- Accessibility: Skip is first in the tab order, focus is visible, animation layers are aria-hidden, the final card's content is readable by screen readers, and contrast meets WCAG AA.
- Performance: the site renders underneath the overlay, the intro is code-split, there's no layout shift, and it targets 60 fps (animate transform and opacity, draw the dots on a canvas).
- Responsive from 360 px to 1920 px. Test iPhone Safari and desktop Chrome.
- No analytics, accounts, or paid services.

## Acceptance checklist
- [ ] First homepage visit in a new session plays the intro; a reload in the same session doesn't.
- [ ] Skip, from any frame, lands on the final card.
- [ ] Every number and date on screen matches `coop-data.json`.
- [ ] The card closes with Esc, the close button, and a backdrop click; "Co-op news" reopens it; "Replay intro" replays.
- [ ] Reduced motion shows the card with no animation.
- [ ] The map fallback works with WebGL disabled.
- [ ] Mobile layout works at 390 px.
- [ ] The Open Graph preview shows the new title, description, and image.
