/** Drop photos into public/images/greece-2026/ and add entries here. */
export const GREECE_GALLERY_DIR = "/images/greece-2026" as const;

export type GreecePhoto = {
  src: string;
  alt: string;
  caption?: string;
  aspect?: "landscape" | "portrait" | "square";
};

export type GreeceTimelineMilestone = {
  id: string;
  date?: string;
  label: string;
  description: string;
  status: "start" | "milestone" | "end";
};

export type GreeceAcademicCourse = {
  id: string;
  title: string;
  institution: string;
  note: string;
  transferLabel?: string;
  transferCode?: string;
  /** Coursework page — update when ready */
  href: string;
};

export type GreecePlace = {
  id: string;
  name: string;
  region: string;
};

export type GreeceReflection = {
  id: string;
  placeholder: string;
};

export const greeceHero = {
  title: "Greece 2026",
  subtitle: "Study Abroad • Athens, Greece",
  description:
    "A month of academic growth, international business, data-driven projects, and unforgettable experiences while studying at the American College of Greece.",
} as const;

export const greeceTimeline: readonly GreeceTimelineMilestone[] = [
  {
    id: "arrival",
    date: "May 16, 2026",
    label: "Arrival in Athens",
    description: "First days in the city — settling in, orientation, and the beginning of the journey.",
    status: "start",
  },
  {
    id: "acg",
    label: "American College of Greece",
    description: "Campus life, lectures, and coursework at Deree in the northern Athens suburb of Agia Paraskevi.",
    status: "milestone",
  },
  {
    id: "projects",
    label: "Project Work",
    description: "Applied business projects, presentations, and collaborative academic deliverables.",
    status: "milestone",
  },
  {
    id: "travel",
    label: "Travel",
    description: "Weekend excursions and exploration across Athens and beyond.",
    status: "milestone",
  },
  {
    id: "presentations",
    label: "Final Presentations",
    description: "Capstone presentations and the culmination of the summer abroad program.",
    status: "milestone",
  },
  {
    id: "return",
    date: "June 19, 2026",
    label: "Return Home",
    description: "Closing the chapter — carrying new perspectives back to Northeastern.",
    status: "end",
  },
] as const;

export const greeceAcademicCourses: readonly GreeceAcademicCourse[] = [
  {
    id: "mgsc2301",
    title: "Business Statistics",
    institution: "Northeastern University",
    note: "Completed remotely while living in Athens.",
    href: "/coursework/mgsc2301",
  },
  {
    id: "mgmt3530",
    title: "Project Management",
    institution: "American College of Greece",
    note: "In-person coursework at Deree, integrated into the study abroad program.",
    transferLabel: "Transferred to Northeastern as",
    transferCode: "MGMT 3530",
    href: "/coursework/mg4057",
  },
  {
    id: "acct2301",
    title: "Profit Analysis for Managers and Advisors",
    institution: "American College of Greece",
    note: "Managerial accounting and profit analysis studied on campus in Athens.",
    transferLabel: "Transferred to Northeastern as",
    transferCode: "ACCT 2301",
    href: "/coursework/af3116",
  },
] as const;

/** Add photo objects here once images are in public/images/greece-2026/ */
export const greeceGalleryPhotos: readonly GreecePhoto[] = [] as const;

export const greeceGalleryMeta = {
  title: "Athens Through My Lens",
  subtitle: "A visual archive of the city, campus, and journeys beyond.",
  comingSoonNote: "Photos coming soon.",
  placeholderCount: 6,
} as const;

export const greecePlaces: readonly GreecePlace[] = [
  { id: "acropolis", name: "Acropolis", region: "Athens" },
  { id: "parthenon", name: "Parthenon", region: "Acropolis Hill" },
  { id: "plaka", name: "Plaka", region: "Historic Center" },
  { id: "monastiraki", name: "Monastiraki", region: "Central Athens" },
  { id: "lycabettus", name: "Lycabettus Hill", region: "Athens" },
] as const;

export const greeceReflections: readonly GreeceReflection[] = [
  {
    id: "reflection-1",
    placeholder: "Reflection on academic life abroad — coming soon.",
  },
  {
    id: "reflection-2",
    placeholder: "Reflection on cultural immersion — coming soon.",
  },
  {
    id: "reflection-3",
    placeholder: "Reflection on growth and perspective — coming soon.",
  },
] as const;

export const greeceTheme = {
  accent: "#c9a962",
  accentRgb: "201, 169, 98",
  aegean: "#3d6b8a",
  aegeanRgb: "61, 107, 138",
} as const;
