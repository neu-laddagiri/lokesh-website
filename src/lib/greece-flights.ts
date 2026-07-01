import type { GreecePhoto } from "@/lib/greece-2026";

export type AirportCode = "BOS" | "DUB" | "ATH" | "JTR" | "CHQ" | "FCO";

export type FlightCategory = "main" | "santorini" | "crete" | "rome";

export type FlightFilterId = "all" | FlightCategory;

export type GreeceAirport = {
  code: AirportCode;
  name: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
};

export type GreeceFlight = {
  id: string;
  order: number;
  category: FlightCategory;
  from: AirportCode;
  to: AirportCode;
  dateIso: string;
  dateDisplay: string;
  departure: string;
  arrival: string;
  duration: string;
  durationMinutes: number;
  airline: string;
  flightNumber: string;
  destinationLabel: string;
  status: "Completed" | "Upcoming";
  arcColor: string;
  arcGlow: string;
  photos?: string[];
  notes?: string;
  seat?: string;
  boardingPassPdf?: string;
  galleryImages?: GreecePhoto[];
};

export const greeceCinematicHero = {
  eyebrow: "Greece 2026",
  title: "My Journey to Greece",
  routeSubtitle: "Boston → Athens → Santorini → Crete → Rome → Boston",
  description:
    "Every flight that took me from Boston to Athens and back — Summer 2026.",
} as const;

export const greeceAirports: Record<AirportCode, GreeceAirport> = {
  BOS: {
    code: "BOS",
    name: "Logan International",
    city: "Boston",
    region: "Massachusetts",
    lat: 42.3656,
    lng: -71.0096,
  },
  DUB: {
    code: "DUB",
    name: "Dublin Airport",
    city: "Dublin",
    region: "Ireland",
    lat: 53.4213,
    lng: -6.2701,
  },
  ATH: {
    code: "ATH",
    name: "Eleftherios Venizelos",
    city: "Athens",
    region: "Greece",
    lat: 37.9364,
    lng: 23.9445,
  },
  JTR: {
    code: "JTR",
    name: "Santorini (Thira)",
    city: "Santorini",
    region: "Greece",
    lat: 36.3992,
    lng: 25.4793,
  },
  CHQ: {
    code: "CHQ",
    name: "Chania International",
    city: "Crete",
    region: "Greece",
    lat: 35.5317,
    lng: 24.1497,
  },
  FCO: {
    code: "FCO",
    name: "Leonardo da Vinci–Fiumicino",
    city: "Rome",
    region: "Italy",
    lat: 41.8003,
    lng: 12.2389,
  },
};

export const greeceFlightFilters: readonly {
  id: FlightFilterId;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "main", label: "Main Trip" },
  { id: "santorini", label: "Santorini" },
  { id: "crete", label: "Crete" },
  { id: "rome", label: "Rome" },
] as const;

export const CATEGORY_COLORS: Record<
  FlightCategory,
  { stroke: string; glow: string; label: string }
> = {
  main: { stroke: "#5B9DFF", glow: "rgba(91, 157, 255, 0.85)", label: "Main Trip" },
  santorini: {
    stroke: "#38BDF8",
    glow: "rgba(56, 189, 248, 0.85)",
    label: "Santorini",
  },
  crete: { stroke: "#2DD4BF", glow: "rgba(45, 212, 191, 0.85)", label: "Crete" },
  rome: { stroke: "#FBBF24", glow: "rgba(251, 191, 36, 0.85)", label: "Rome" },
};

function computeDuration(departure: string, arrival: string): {
  label: string;
  minutes: number;
} {
  const [dh, dm] = departure.split(":").map(Number);
  const [ah, am] = arrival.split(":").map(Number);
  let depMins = dh * 60 + dm;
  let arrMins = ah * 60 + am;
  if (arrMins <= depMins) arrMins += 24 * 60;
  const diff = arrMins - depMins;
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hours === 0) return { label: `${mins}m`, minutes: diff };
  if (mins === 0) return { label: `${hours}h`, minutes: diff };
  return { label: `${hours}h ${mins}m`, minutes: diff };
}

function flight(
  data: Omit<
    GreeceFlight,
    "duration" | "durationMinutes" | "arcColor" | "arcGlow"
  > & {
    arcColor?: string;
    arcGlow?: string;
  },
): GreeceFlight {
  const dur = computeDuration(data.departure, data.arrival);
  const cat = CATEGORY_COLORS[data.category];
  return {
    ...data,
    duration: dur.label,
    durationMinutes: dur.minutes,
    arcColor: data.arcColor ?? cat.stroke,
    arcGlow: data.arcGlow ?? cat.glow,
  };
}

/** Chronological journey order */
export const greeceFlights: readonly GreeceFlight[] = [
  flight({
    id: "ei-132-out",
    order: 1,
    category: "main",
    from: "BOS",
    to: "DUB",
    dateIso: "2026-05-16",
    dateDisplay: "May 16, 2026",
    departure: "17:25",
    arrival: "04:35",
    airline: "Aer Lingus",
    flightNumber: "EI 0132",
    destinationLabel: "Dublin",
    status: "Completed",
    arcColor: "#5B9DFF",
    arcGlow: "rgba(91, 157, 255, 0.9)",
  }),
  flight({
    id: "ei-440-out",
    order: 2,
    category: "main",
    from: "DUB",
    to: "ATH",
    dateIso: "2026-05-16",
    dateDisplay: "May 16, 2026",
    departure: "06:00",
    arrival: "12:10",
    airline: "Aer Lingus",
    flightNumber: "EI 0440",
    destinationLabel: "Athens",
    status: "Completed",
    arcColor: "#A78BFA",
    arcGlow: "rgba(167, 139, 250, 0.9)",
  }),
  flight({
    id: "fr-1232-santorini-out",
    order: 3,
    category: "santorini",
    from: "ATH",
    to: "JTR",
    dateIso: "2026-05-30",
    dateDisplay: "May 30, 2026",
    departure: "06:15",
    arrival: "07:05",
    airline: "Ryanair",
    flightNumber: "FR 1232",
    destinationLabel: "Santorini",
    status: "Completed",
  }),
  flight({
    id: "fr-6923-santorini-return",
    order: 4,
    category: "santorini",
    from: "JTR",
    to: "ATH",
    dateIso: "2026-06-01",
    dateDisplay: "Jun 1, 2026",
    departure: "19:55",
    arrival: "20:45",
    airline: "Ryanair",
    flightNumber: "FR 6923",
    destinationLabel: "Athens",
    status: "Completed",
  }),
  flight({
    id: "fr-318-crete-out",
    order: 5,
    category: "crete",
    from: "ATH",
    to: "CHQ",
    dateIso: "2026-06-05",
    dateDisplay: "Jun 5, 2026",
    departure: "07:20",
    arrival: "08:15",
    airline: "Ryanair",
    flightNumber: "FR 318",
    destinationLabel: "Crete",
    status: "Completed",
  }),
  flight({
    id: "fr-319-crete-return",
    order: 6,
    category: "crete",
    from: "CHQ",
    to: "ATH",
    dateIso: "2026-06-07",
    dateDisplay: "Jun 7, 2026",
    departure: "20:50",
    arrival: "21:45",
    airline: "Ryanair",
    flightNumber: "FR 319",
    destinationLabel: "Athens",
    status: "Completed",
  }),
  flight({
    id: "fr-1199-rome-out",
    order: 7,
    category: "rome",
    from: "ATH",
    to: "FCO",
    dateIso: "2026-06-13",
    dateDisplay: "Jun 13, 2026",
    departure: "06:10",
    arrival: "07:20",
    airline: "Ryanair",
    flightNumber: "FR 1199",
    destinationLabel: "Rome",
    status: "Completed",
  }),
  flight({
    id: "fr-1298-rome-return",
    order: 8,
    category: "rome",
    from: "FCO",
    to: "ATH",
    dateIso: "2026-06-13",
    dateDisplay: "Jun 13, 2026",
    departure: "20:35",
    arrival: "23:35",
    airline: "Ryanair",
    flightNumber: "FR 1298",
    destinationLabel: "Athens",
    status: "Completed",
  }),
  flight({
    id: "ei-441-return",
    order: 9,
    category: "main",
    from: "ATH",
    to: "DUB",
    dateIso: "2026-06-19",
    dateDisplay: "Jun 19, 2026",
    departure: "13:00",
    arrival: "15:30",
    airline: "Aer Lingus",
    flightNumber: "EI 0441",
    destinationLabel: "Dublin",
    status: "Completed",
    arcColor: "#60A5FA",
    arcGlow: "rgba(96, 165, 250, 0.9)",
  }),
  flight({
    id: "ei-137-return",
    order: 10,
    category: "main",
    from: "DUB",
    to: "BOS",
    dateIso: "2026-06-19",
    dateDisplay: "Jun 19, 2026",
    departure: "16:45",
    arrival: "18:50",
    airline: "Aer Lingus",
    flightNumber: "EI 0137",
    destinationLabel: "Boston",
    status: "Completed",
    arcColor: "#F5C563",
    arcGlow: "rgba(245, 197, 99, 0.9)",
  }),
] as const;

export const TOTAL_FLIGHTS = greeceFlights.length;

export function flightRouteLabel(f: GreeceFlight): string {
  return `${f.from} → ${f.to}`;
}

export function filterFlights(
  flights: readonly GreeceFlight[],
  filter: FlightFilterId,
): GreeceFlight[] {
  if (filter === "all") return [...flights];
  return flights.filter((f) => f.category === filter);
}

export function sortFlightsByOrder(
  flights: readonly GreeceFlight[],
): GreeceFlight[] {
  return [...flights].sort((a, b) => a.order - b.order);
}

export function getVisibleAirportCodes(
  flights: readonly GreeceFlight[],
): AirportCode[] {
  const codes = new Set<AirportCode>();
  for (const f of flights) {
    codes.add(f.from);
    codes.add(f.to);
  }
  return [...codes];
}

export function computeTotalJourneyTime(
  flights: readonly GreeceFlight[],
): string {
  const totalMins = flights.reduce((sum, f) => sum + f.durationMinutes, 0);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export function greatCirclePath(
  from: AirportCode,
  to: AirportCode,
  steps = 80,
): [number, number][] {
  const a = greeceAirports[from];
  const b = greeceAirports[to];
  const lat1 = toRad(a.lat);
  const lon1 = toRad(a.lng);
  const lat2 = toRad(b.lat);
  const lon2 = toRad(b.lng);

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2,
      ),
    );

  if (d === 0) return [[a.lng, a.lat]];

  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x =
      A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y =
      A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    points.push([toDeg(Math.atan2(y, x)), toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)))]);
  }
  return points;
}

export type LngLatBounds = [[number, number], [number, number]];

export function boundsFromAirports(
  codes: AirportCode[],
  paddingDeg = 2,
): LngLatBounds {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const code of codes) {
    const ap = greeceAirports[code];
    minLng = Math.min(minLng, ap.lng);
    maxLng = Math.max(maxLng, ap.lng);
    minLat = Math.min(minLat, ap.lat);
    maxLat = Math.max(maxLat, ap.lat);
  }
  return [
    [minLng - paddingDeg, minLat - paddingDeg],
    [maxLng + paddingDeg, maxLat + paddingDeg],
  ];
}

export function boundsFromFlights(
  flights: readonly GreeceFlight[],
  paddingDeg = 2.5,
): LngLatBounds {
  return boundsFromAirports(getVisibleAirportCodes(flights), paddingDeg);
}

export type FilterViewport =
  | { type: "bounds"; bounds: LngLatBounds }
  | { type: "center"; center: [number, number]; zoom: number };

export function getFilterViewport(filter: FlightFilterId): FilterViewport {
  switch (filter) {
    case "main":
      return { type: "bounds", bounds: boundsFromAirports(["BOS", "DUB", "ATH"], 5) };
    case "santorini":
      return { type: "bounds", bounds: boundsFromAirports(["ATH", "JTR"], 1.5) };
    case "crete":
      return { type: "bounds", bounds: boundsFromAirports(["ATH", "CHQ"], 1.8) };
    case "rome":
      return { type: "bounds", bounds: boundsFromAirports(["ATH", "FCO"], 2.5) };
    case "all":
    default:
      return { type: "bounds", bounds: boundsFromFlights(greeceFlights, 8) };
  }
}

/** NASA VIIRS Black Marble night lights + subtle terrain labels */
export const NIGHT_EARTH_MAP_STYLE = {
  version: 8 as const,
  name: "Night Earth",
  sources: {
    night: {
      type: "raster" as const,
      tiles: [
        "https://gibs-a.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg",
      ],
      tileSize: 256,
      attribution: "NASA EOSDIS GIBS",
      maxzoom: 8,
    },
    terrain: {
      type: "raster" as const,
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "Esri",
    },
    labels: {
      type: "raster" as const,
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: "terrain",
      type: "raster" as const,
      source: "terrain",
      paint: { "raster-opacity": 0.35, "raster-brightness-min": 0.05, "raster-brightness-max": 0.45 },
    },
    {
      id: "night",
      type: "raster" as const,
      source: "night",
      paint: { "raster-opacity": 0.92 },
    },
    {
      id: "labels",
      type: "raster" as const,
      source: "labels",
      paint: { "raster-opacity": 0.28 },
    },
  ],
};

export function categoryLabel(category: FlightCategory): string {
  return CATEGORY_COLORS[category].label;
}

export function formatTime12h(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}
