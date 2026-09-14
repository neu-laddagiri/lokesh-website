/** Photos live in public/images/greece-2026/. */
export const GREECE_GALLERY_DIR = "/images/greece-2026" as const;

export const greeceTheme = {
  /** Greek flag blue, shared with the homepage preview card. */
  accent: "#0d5eaf",
  accentRgb: "13, 94, 175",
  aegean: "#3d6b8a",
  aegeanRgb: "61, 107, 138",
  gold: "#c9a962",
  goldRgb: "201, 169, 98",
} as const;

export const greeceHero = {
  eyebrow: "Study Abroad",
  title: "Greece 2026",
  subtitle: "Athens, the islands, and one detour to Rome",
  description:
    "Five weeks based in Athens on the Northeastern summer program: three courses, a 4.0, and ten flights across six airports. Everything below is from the trip itself.",
} as const;

export const greeceStats = [
  { value: "5", label: "Weeks abroad" },
  { value: "3", label: "Courses" },
  { value: "4.0", label: "GPA abroad" },
  { value: "10", label: "Flights" },
] as const;

/* --------------------------------------------------------------- academics */

export type GreeceCourse = {
  id: string;
  neuCode: string;
  neuTitle: string;
  acgCode?: string;
  institution: string;
  mode: string;
  credits: string;
  summary: string;
  topics: readonly string[];
  href: string;
  accent: string;
};

export const greeceCourses: readonly GreeceCourse[] = [
  {
    id: "mgmt3530",
    neuCode: "MGMT 3530",
    neuTitle: "Project Management",
    acgCode: "MG 4057",
    institution: "American College of Greece (Deree)",
    mode: "On campus in Agia Paraskevi",
    credits: "4 semester hours",
    summary:
      "Planned a Smart Health Monitoring System implementation end to end, from scope definition through deployment strategy, as a graded team project.",
    topics: [
      "Work Breakdown Structure",
      "Gantt scheduling",
      "Critical path",
      "Risk registers",
      "Stakeholder analysis",
      "Microsoft Project",
    ],
    href: "/coursework/mg4057",
    accent: "#8045da",
  },
  {
    id: "acct2301",
    neuCode: "ACCT 2301",
    neuTitle: "Profit Analysis for Managers and Advisors",
    acgCode: "AF 3116",
    institution: "American College of Greece (Deree)",
    mode: "On campus in Agia Paraskevi",
    credits: "4 semester hours",
    summary:
      "Managerial accounting from the decision maker's side: how cost behavior, contribution margin, and variance analysis drive operating choices.",
    topics: [
      "Cost behavior",
      "Contribution margin",
      "CVP analysis",
      "Budgeting",
      "Variance analysis",
      "Relevant costing",
    ],
    href: "/coursework/af3116",
    accent: "#0d9488",
  },
  {
    id: "mgsc2301",
    neuCode: "MGSC 2301",
    neuTitle: "Business Statistics",
    institution: "Northeastern University",
    mode: "Run remotely from Athens",
    credits: "4 semester hours",
    summary:
      "Taken asynchronously across the time difference while the other two ran on campus. Regression and inference work in SPSS, including the SEC football spending project.",
    topics: [
      "Regression",
      "ANOVA",
      "Hypothesis testing",
      "Confidence intervals",
      "SPSS",
    ],
    href: "/coursework/mgsc2301",
    accent: "#1b698f",
  },
] as const;

export const greeceAcademicsMeta = {
  campus: "Deree, the American College of Greece",
  neighborhood: "Agia Paraskevi, northern Athens",
  term: "Summer I 2026, May 16 to June 19",
  note: "Both Deree courses transferred back to Northeastern for credit. Each card links to the syllabus and the graded work in the archive.",
} as const;

/* ---------------------------------------------------------------- timeline */

export type GreeceTimelineMilestone = {
  id: string;
  date: string;
  label: string;
  description: string;
};

export const greeceTimeline: readonly GreeceTimelineMilestone[] = [
  {
    id: "arrival",
    date: "May 16 to 17",
    label: "Boston to Athens",
    description:
      "Overnight through Dublin, landing in Athens the next afternoon. Orientation and moving into housing.",
  },
  {
    id: "classes",
    date: "May 18 onward",
    label: "Classes start at Deree",
    description:
      "Project Management and Profit Analysis on campus, Business Statistics remote across the seven-hour difference.",
  },
  {
    id: "santorini",
    date: "May 30 to Jun 1",
    label: "Santorini",
    description:
      "Two nights in Oia for the caldera sunset, and a full moon over the Aegean on the way back down the steps.",
  },
  {
    id: "crete",
    date: "Jun 5 to 7",
    label: "Crete",
    description:
      "Chania old harbor, the Venetian lighthouse at sunset, and the turquoise cove at Seitan Limania.",
  },
  {
    id: "rome",
    date: "Jun 13",
    label: "Rome, same day",
    description:
      "Out to Fiumicino in the morning and back to Athens that night: the Colosseum, the Forum, the Pantheon, and St. Peter's in one run.",
  },
  {
    id: "finals",
    date: "Jun 16 to 18",
    label: "Final presentations",
    description:
      "Team deliverables and finals for both Deree courses. Finished the term at a 4.0.",
  },
  {
    id: "return",
    date: "Jun 19",
    label: "Athens to Boston",
    description: "Back through Dublin, home the same day.",
  },
] as const;

/* ------------------------------------------------------------------ places */

export type GreecePlace = {
  id: string;
  name: string;
  region: string;
  note: string;
};

export const greecePlaces: readonly GreecePlace[] = [
  {
    id: "acropolis",
    name: "The Acropolis",
    region: "Athens",
    note: "Climbed it in daylight and saw it lit from Areopagus at night.",
  },
  {
    id: "plaka",
    name: "Plaka and Monastiraki",
    region: "Athens",
    note: "The old quarter under the rock, and the flea market square.",
  },
  {
    id: "lycabettus",
    name: "Lycabettus Hill",
    region: "Athens",
    note: "Dinner above the city with the whole basin lit up below.",
  },
  {
    id: "filopappou",
    name: "Filopappou Hill",
    region: "Athens",
    note: "The widest view of the Acropolis and the Temple of Hephaestus.",
  },
  {
    id: "oia",
    name: "Oia",
    region: "Santorini",
    note: "Caldera sunset, blue domes, and the moon over the water after.",
  },
  {
    id: "chania",
    name: "Chania",
    region: "Crete",
    note: "Venetian harbor and the lighthouse at golden hour.",
  },
  {
    id: "seitan",
    name: "Seitan Limania",
    region: "Crete",
    note: "A narrow turquoise inlet at the bottom of a steep goat path.",
  },
  {
    id: "elafonissi",
    name: "Elafonissi",
    region: "Crete",
    note: "Shallow, clear, and warm enough to walk out a long way.",
  },
  {
    id: "rome",
    name: "Rome and the Vatican",
    region: "Italy",
    note: "Colosseum, Forum, Pantheon, Piazza Navona, Castel Sant'Angelo, St. Peter's.",
  },
] as const;

/* ----------------------------------------------------------------- gallery */

export type GalleryGroupId = "athens" | "islands" | "italy";

export type GalleryEntry = {
  /** Base filename, without extension, in public/images/greece-2026/. */
  slug: string;
  group: GalleryGroupId;
  alt: string;
  caption: string;
  /** Wide entries span two columns. */
  wide?: boolean;
};

export const galleryGroups: readonly {
  id: GalleryGroupId;
  label: string;
  blurb: string;
}[] = [
  { id: "athens", label: "Athens", blurb: "Home base for five weeks." },
  { id: "islands", label: "The islands", blurb: "Santorini and Crete." },
  { id: "italy", label: "Rome", blurb: "One very long day trip." },
] as const;

/**
 * Captions are written ahead of the files. The gallery renders only the
 * entries whose image actually exists on disk, so adding a photo is a drag
 * and drop with no code change.
 */
export const galleryEntries: readonly GalleryEntry[] = [
  {
    slug: "athens-acropolis-parthenon",
    group: "athens",
    alt: "The Parthenon on the Acropolis with the Greek flag flying above Athens",
    caption: "The Parthenon, and the flag at the east end of the rock",
    wide: true,
  },
  {
    slug: "athens-acropolis-night",
    group: "athens",
    alt: "The Acropolis floodlit at night, seen from Areopagus hill",
    caption: "The Acropolis lit up, from Areopagus",
  },
  {
    slug: "athens-hephaisteion-cats",
    group: "athens",
    alt: "Two cats on a wall overlooking the Temple of Hephaestus and the Athens skyline",
    caption: "Two regulars above the Temple of Hephaestus",
  },
  {
    slug: "athens-lycabettus-dinner",
    group: "athens",
    alt: "Rooftop dinner above Athens at night with the city lights below",
    caption: "Dinner above the city",
  },
  {
    slug: "athens-monastiraki-views",
    group: "athens",
    alt: "Alexander the Great statue, Monastiraki square, and a panorama of Athens at sunset",
    caption: "Monastiraki, and the view from Filopappou",
  },
  {
    slug: "athens-nightlife",
    group: "athens",
    alt: "Little Kook cafe in Athens at night and an evening out with friends",
    caption: "Little Kook, which has to be seen to be explained",
  },
  {
    slug: "athens-street-cats",
    group: "athens",
    alt: "Grid of street cats photographed around Athens",
    caption: "A running tally of the Athens street cats",
    wide: true,
  },
  {
    slug: "greece-food",
    group: "athens",
    alt: "Greek food including souvlaki, gyros, pizza, and group dinners",
    caption: "Souvlaki, gyros, and a lot of shared tables",
  },
  {
    slug: "santorini-caldera-sunset",
    group: "islands",
    alt: "Sunset over the Santorini caldera, Oia terraces, and a full moon over the Aegean",
    caption: "Caldera sunset from Oia, and the moon an hour later",
    wide: true,
  },
  {
    slug: "santorini-oia-night",
    group: "islands",
    alt: "Oia at night with blue domed churches lit above the caldera",
    caption: "Oia after dark",
  },
  {
    slug: "crete-seitan-limania",
    group: "islands",
    alt: "The turquoise inlet at Seitan Limania beach in Crete",
    caption: "Seitan Limania, down a very steep path",
  },
  {
    slug: "crete-elafonissi-beach",
    group: "islands",
    alt: "Clear shallow water and pale sand on a Crete beach",
    caption: "Water clear enough to see your feet a long way out",
  },
  {
    slug: "crete-chania-harbor",
    group: "islands",
    alt: "Chania old Venetian harbor and lighthouse at sunset, and the old town streets",
    caption: "Chania harbor and the Venetian lighthouse",
    wide: true,
  },
  {
    slug: "rome-colosseum",
    group: "italy",
    alt: "The Colosseum in Rome from several angles",
    caption: "The Colosseum, first stop off the plane",
    wide: true,
  },
  {
    slug: "rome-forum-vittoriano",
    group: "italy",
    alt: "The Roman Forum from above and the Altare della Patria",
    caption: "The Forum from the Capitoline, and the Vittoriano",
  },
  {
    slug: "rome-pantheon-navona-castel",
    group: "italy",
    alt: "The Pantheon, Piazza Navona, and Castel Sant'Angelo in Rome",
    caption: "Pantheon, Piazza Navona, Castel Sant'Angelo",
  },
  {
    slug: "rome-vatican-stpeters",
    group: "italy",
    alt: "St. Peter's Basilica facade and the fountain in St. Peter's Square",
    caption: "St. Peter's Square",
  },
  {
    slug: "rome-vatican-interior",
    group: "italy",
    alt: "Interior of St. Peter's Basilica including the baldachin and the dome",
    caption: "Inside St. Peter's",
  },
  {
    slug: "rome-tiber-stpeters",
    group: "italy",
    alt: "The Tiber river, a Roman street, and the dome of St. Peter's",
    caption: "Walking in along the Tiber",
  },
  {
    slug: "italy-food",
    group: "italy",
    alt: "Italian coffee with latte art, pasta, and a toast",
    caption: "The only correct way to spend a layover",
  },
] as const;
