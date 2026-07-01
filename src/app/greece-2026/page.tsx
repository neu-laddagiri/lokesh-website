"use client";

import { GreeceAcademics } from "@/components/greece-2026/greece-academics";
import { GreeceCinematicHero } from "@/components/greece-2026/greece-cinematic-hero";
import { GreeceGallery } from "@/components/greece-2026/greece-gallery";
import { GreeceFooter, GreeceNav } from "@/components/greece-2026/greece-nav";
import { GreecePlaces } from "@/components/greece-2026/greece-places";
import { GreeceReflections } from "@/components/greece-2026/greece-reflections";
import { GreeceTimeline } from "@/components/greece-2026/greece-timeline";

export default function Greece2026Page() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <GreeceNav />

      <main className="relative z-10">
        <GreeceCinematicHero />
        <div className="relative bg-background">
          <div className="pointer-events-none absolute inset-0">
            <div className="ambient-grid absolute inset-0 opacity-40" />
          </div>
          <GreeceTimeline />
          <GreeceAcademics />
          <GreeceGallery />
          <GreecePlaces />
          <GreeceReflections />
        </div>
      </main>

      <GreeceFooter />
    </div>
  );
}
