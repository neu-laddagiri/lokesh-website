import data from "../../handoff/coop/coop-data.json";
import type { LngLat } from "@/lib/geo";

/**
 * Everything the co-op announcement shows comes from coop-data.json. This file
 * only formats and derives: no number, date, or place here is typed by hand,
 * so the intro, the card, and the Open Graph image cannot disagree.
 */

const { search, coop, map } = data;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

function dateParts(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
}

/** "2026-09-29" to "September 29". */
export function longDate(iso: string): string {
  const { month, day } = dateParts(iso);
  return `${MONTHS[month - 1]} ${day}`;
}

/** "2026-11-02" to "Nov 2". */
export function shortDate(iso: string): string {
  const { month, day } = dateParts(iso);
  return `${MONTHS[month - 1].slice(0, 3)} ${day}`;
}

/** "2026-10" to "October". */
function monthName(key: string): string {
  return MONTHS[Number(key.split("-")[1]) - 1];
}

const start = dateParts(coop.start);
const end = dateParts(coop.end);
const city = coop.location.split(",")[0];

/** "January 6 to June 25, 2027", or both years if the co-op ever spans two. */
const coopDates =
  start.year === end.year
    ? `${longDate(coop.start)} to ${longDate(coop.end)}, ${end.year}`
    : `${longDate(coop.start)}, ${start.year} to ${longDate(coop.end)}, ${end.year}`;

export const COOP = {
  company: coop.company,
  title: coop.title,
  location: coop.location,
  summary: coop.summary,
  heading: `I'm joining ${coop.company} this spring`,
  placeAndDates: `${city}, ${coopDates}`,
  dates: coopDates,
  /** For the hero pill and Experience: "Incoming Technology Services Group Co-op at Verisk". */
  incoming: `Incoming ${coop.title} at ${coop.company}`,
  /** Experience-list period, in the site's "Jan to Jun 2027" style. */
  period:
    start.year === end.year
      ? `${MONTHS[start.month - 1].slice(0, 3)} to ${MONTHS[end.month - 1].slice(0, 3)} ${end.year}`
      : `${MONTHS[start.month - 1].slice(0, 3)} ${start.year} to ${MONTHS[end.month - 1].slice(0, 3)} ${end.year}`,
} as const;

export type TimelineStep = { iso: string; date: string; label: string };

export const TIMELINE: readonly TimelineStep[] = coop.timeline.map((step) => ({
  iso: step.date,
  date: shortDate(step.date),
  label: step.label,
}));

export type CoopStat =
  | { kind: "number"; value: number; label: string }
  /** `short` is the same date in a narrow column: "Sep 29". */
  | { kind: "date"; value: string; short: string; label: string };

/** A stat as the data file has it: a count can still be null. */
type MaybeStat =
  | { kind: "number"; value: number | null; label: string }
  | { kind: "date"; value: string; short: string; label: string };

/** Keeps only stats with a value: the spec hides anything still null. */
function present(stats: readonly MaybeStat[]): CoopStat[] {
  return stats.filter((stat): stat is CoopStat => stat.value !== null);
}

const [busiestMonth, busiestCount] = Object.entries(search.applicationsByMonth).reduce(
  (best, entry) => (entry[1] > best[1] ? entry : best),
);

/** Scene 2: the search in numbers, in the order the spec lists them. */
export const SEARCH_COUNTERS: readonly CoopStat[] = present([
  { kind: "number", value: search.coopApplications, label: "co-op applications" },
  { kind: "number", value: search.companies, label: "companies" },
  {
    kind: "date",
    value: longDate(search.firstApplication),
    short: shortDate(search.firstApplication),
    label: "first application",
  },
  { kind: "number", value: busiestCount, label: `applications in ${monthName(busiestMonth)}` },
  { kind: "number", value: search.tailoredResumes, label: "tailored resumes" },
  { kind: "number", value: search.networkingContacts, label: "people met along the way" },
  { kind: "number", value: search.careerFairsAttended, label: "career fairs attended" },
]);

/** Scene 3: the funnel. */
export const FUNNEL = {
  dimmed: { kind: "number", value: search.rejectedOrWithdrawn, label: "rejected or withdrawn" },
  glowing: { kind: "number", value: search.interviewInvites, label: "interview invites" },
} as const satisfies Record<string, CoopStat>;

/** The card's four stats. */
export const CARD_STATS: readonly CoopStat[] = present([
  { kind: "number", value: search.coopApplications, label: "co-op applications" },
  { kind: "number", value: search.interviewInvites, label: "interview invites" },
  {
    kind: "number",
    value: search.daysFromVeriskApplicationToOffer,
    label: "days from application to offer",
  },
  { kind: "number", value: search.accepted, label: "yes" },
]);

/** "a, b, and c" */
function listSentence(items: readonly string[]): string {
  if (items.length <= 2) return items.join(" and ");
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/** The homepage's link preview, as LinkedIn and messaging apps show it. */
export const COOP_SHARE = {
  title: `${COOP.heading} | Lokesh Addagiri`,
  description: `${coop.title} at ${coop.company} in ${city} from ${coopDates}. The search behind it: ${listSentence(
    CARD_STATS.filter((stat) => stat.label !== "yes").map((stat) => `${stat.value} ${stat.label}`),
  )}.`,
} as const;

/** One dot per application, and how many of them dim and glow. */
export const DOTS = {
  total: search.coopApplications,
  dimmed: search.rejectedOrWithdrawn,
  glowing: search.interviewInvites,
} as const;

function point(entry: { approxLngLat: number[]; lngLat?: number[] }): LngLat {
  const [lng, lat] = entry.lngLat ?? entry.approxLngLat;
  return [lng, lat];
}

export const COOP_MAP = {
  office: point(map.office),
  officeLabel: map.office.label,
  origin: point(map.origin),
  originLabel: map.origin.label,
} as const;

export type CoopLogo = { name: string; src: string; file: string };

const logo = (entry: { name: string; logo: string | null }): CoopLogo[] =>
  entry.logo ? [{ name: entry.name, file: entry.logo, src: `/coop/logos/${entry.logo}` }] : [];

/** Organizations first, then the project marks, all from the data file. */
export const ORBIT_LOGOS: readonly CoopLogo[] = [
  ...data.organizations.flatMap(logo),
  ...data.projects.flatMap(logo),
];

/** The spec caps the phone orbit at five. These are the two halves of the major, the two new roles, and Greece. */
const PHONE_ORBIT_FILES = ["khoury.png", "dmsb.png", "informs.png", "fbc.jpg", "acg.jpg"];
export const PHONE_ORBIT_LOGOS: readonly CoopLogo[] = PHONE_ORBIT_FILES.flatMap((file) =>
  ORBIT_LOGOS.filter((entry) => entry.file === file),
);

/** sessionStorage key from the spec. */
export const INTRO_SEEN_KEY = "coopIntroSeen";

/** Cheap guards so an edit to the data file cannot quietly put wrong numbers on screen. */
if (process.env.NODE_ENV !== "production") {
  const problems: string[] = [];
  if (search.rejected + search.withdrawn !== search.rejectedOrWithdrawn)
    problems.push("rejected + withdrawn does not equal rejectedOrWithdrawn");
  if (search.rejectedOrWithdrawn + search.stillPendingWhenAccepted + search.accepted !== search.coopApplications)
    problems.push("rejectedOrWithdrawn + stillPendingWhenAccepted + accepted does not equal coopApplications");
  if (search.interviewInviteList.length !== search.interviewInvites)
    problems.push("interviewInviteList length does not equal interviewInvites");
  const monthly = Object.values(search.applicationsByMonth).reduce((a, b) => a + b, 0);
  if (monthly !== search.coopApplications) problems.push("applicationsByMonth does not sum to coopApplications");
  if (problems.length) console.warn(`coop-data.json is inconsistent: ${problems.join("; ")}`);
}
