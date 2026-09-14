import { BackgroundSection } from "@/components/home/background-section";
import { ConnectSection } from "@/components/home/connect-section";
import { CourseworkSection } from "@/components/home/coursework-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { GreecePreview } from "@/components/home/greece-preview";
import { Hero } from "@/components/home/hero";
import { HomeNav, SiteFooter } from "@/components/home/home-nav";
import { ProjectsSection } from "@/components/home/projects-section";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="ambient-grid absolute inset-0" />
      </div>

      <HomeNav />

      <main className="relative z-10">
        <Hero />
        <BackgroundSection />
        <ProjectsSection />
        <ExperienceSection />
        <CourseworkSection />
        <GreecePreview />
        <ConnectSection />
      </main>

      <SiteFooter />
    </div>
  );
}
