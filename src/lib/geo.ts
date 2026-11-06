/** A point as MapLibre takes it: longitude first. */
export type LngLat = readonly [number, number];

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/** Central angle between two points, in radians. */
function centralAngle(from: LngLat, to: LngLat): number {
  const lat1 = toRad(from[1]);
  const lat2 = toRad(to[1]);
  const dLat = lat2 - lat1;
  const dLng = toRad(to[0] - from[0]);
  return (
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2,
      ),
    )
  );
}

/**
 * The point a fraction `f` of the way along the great circle from `from` to
 * `to`. Shared by the Greece flight map and the co-op intro's Athens to Boston
 * arc, so both draw the same geodesic.
 */
export function greatCirclePoint(from: LngLat, to: LngLat, f: number): [number, number] {
  const d = centralAngle(from, to);
  if (d === 0) return [from[0], from[1]];
  const lat1 = toRad(from[1]);
  const lon1 = toRad(from[0]);
  const lat2 = toRad(to[1]);
  const lon2 = toRad(to[0]);
  const A = Math.sin((1 - f) * d) / Math.sin(d);
  const B = Math.sin(f * d) / Math.sin(d);
  const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
  const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
  const z = A * Math.sin(lat1) + B * Math.sin(lat2);
  return [toDeg(Math.atan2(y, x)), toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)))];
}

/** `steps + 1` points along the great circle, endpoints included. */
export function greatCircle(from: LngLat, to: LngLat, steps = 80): [number, number][] {
  if (centralAngle(from, to) === 0) return [[from[0], from[1]]];
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) points.push(greatCirclePoint(from, to, i / steps));
  return points;
}

/** Distance in meters, for sanity checks on coordinates. */
export function distanceMeters(from: LngLat, to: LngLat): number {
  return 6371000 * centralAngle(from, to);
}
