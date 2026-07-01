import { PROFILE_LINKS } from "@/lib/profile-links";

export type SiteNavLink = {
  label: string;
  href: string;
  external?: boolean;
};

/** Navigation on the home page (hash anchors + routes). */
export const homeNavLinks: readonly SiteNavLink[] = [
  { label: "About", href: "#about" },
  { label: "Greece 2026", href: "/greece-2026" },
  { label: "Coursework", href: "#coursework" },
  { label: "Resume", href: PROFILE_LINKS.resume, external: true },
  { label: "Contact", href: "#contact" },
] as const;

/** Navigation on subpages (coursework, Greece 2026, etc.). */
export const subpageNavLinks: readonly SiteNavLink[] = [
  { label: "About", href: "/#about" },
  { label: "Greece 2026", href: "/greece-2026" },
  { label: "Coursework", href: "/coursework" },
  { label: "Resume", href: PROFILE_LINKS.resume, external: true },
  { label: "Contact", href: "/#contact" },
] as const;

export function isNavLinkActive(
  link: SiteNavLink,
  pathname: string,
): boolean {
  if (link.label === "Greece 2026") {
    return pathname.startsWith("/greece-2026");
  }
  if (link.label === "Coursework") {
    return pathname.startsWith("/coursework");
  }
  return false;
}
