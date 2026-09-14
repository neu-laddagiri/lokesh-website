import { GreeceAcademics } from "@/components/greece-2026/greece-academics";
import { GreeceGallery } from "@/components/greece-2026/greece-gallery";
import { GreeceFooter, GreeceNav } from "@/components/greece-2026/greece-nav";
import { GreecePlaces } from "@/components/greece-2026/greece-places";
import { GreeceRouteHero } from "@/components/greece-2026/greece-route-hero";
import { GreeceTimeline } from "@/components/greece-2026/greece-timeline";

export default function Greece2026Page() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <GreeceNav />

      <main className="relative z-10">
        <GreeceRouteHero />

        <div className="relative bg-background">
          <div className="pointer-events-none absolute inset-0">
            <div className="ambient-grid absolute inset-0 opacity-40" />
          </div>
          <GreeceAcademics />
          <GreeceGallery />
          <GreeceTimeline />
          <GreecePlaces />
        </div>
      </main>

      <GreeceFooter />
    </div>
  );
}
