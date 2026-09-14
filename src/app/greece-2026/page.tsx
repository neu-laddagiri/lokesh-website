import { GreeceAcademics } from "@/components/greece-2026/greece-academics";
import { GreeceGallery } from "@/components/greece-2026/greece-gallery";
import { GreeceHero } from "@/components/greece-2026/greece-hero";
import { GreeceFooter, GreeceNav } from "@/components/greece-2026/greece-nav";
import { GreecePlaces } from "@/components/greece-2026/greece-places";
import { GreeceRoute } from "@/components/greece-2026/greece-route";
import { GreeceTimeline } from "@/components/greece-2026/greece-timeline";

export default function Greece2026Page() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="ambient-grid absolute inset-0 opacity-40" />
      </div>

      <GreeceNav />

      <main className="relative z-10">
        <GreeceHero />
        <GreeceAcademics />
        <GreeceGallery />
        <GreeceRoute />
        <GreeceTimeline />
        <GreecePlaces />
      </main>

      <GreeceFooter />
    </div>
  );
}
