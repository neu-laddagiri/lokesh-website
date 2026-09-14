import { PROFILE_LINKS } from "@/lib/profile-links";

export type SiteNavLink = {
  label: string;
  href: string;
  external?: boolean;
};

/** Navigation on the home page (hash anchors + routes). */
export const homeNavLinks: readonly SiteNavLink[] = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Coursework", href: "#coursework" },
  { label: "Greece 2026", href: "/greece-2026" },
  { label: "Resume", href: PROFILE_LINKS.resume, external: true },
  { label: "Contact", href: "#contact" },
] as const;

/** Navigation on subpages (projects, coursework, Greece 2026, etc.). */
export const subpageNavLinks: readonly SiteNavLink[] = [
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Coursework", href: "/coursework" },
  { label: "Greece 2026", href: "/greece-2026" },
  { label: "Resume", href: PROFILE_LINKS.resume, external: true },
  { label: "Contact", href: "/#contact" },
] as const;

export function isNavLinkActive(link: SiteNavLink, pathname: string): boolean {
  if (link.label === "Greece 2026") {
    return pathname.startsWith("/greece-2026");
  }
  if (link.label === "Coursework") {
    return pathname.startsWith("/coursework");
  }
  if (link.label === "Projects") {
    return pathname.startsWith("/projects");
  }
  return false;
}
