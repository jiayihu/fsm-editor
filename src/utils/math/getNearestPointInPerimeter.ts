/**
 * JS porting of https://stackoverflow.com/questions/20453545/how-to-find-the-nearest-point-in-the-perimeter-of-a-rectangle-to-a-given-point
 */

function clamp(x: number, lower: number, upper: number): number {
  return Math.max(lower, Math.min(upper, x));
}

export function getNearestPointInPerimeter(
  l: number,
  t: number,
  w: number,
  h: number,
  x: number,
  y: number
) {
  const r = l + w;
  const b = t + h;

  x = clamp(x, l, r);
  y = clamp(y, t, b);

  const dl = Math.abs(x - l);
  const dr = Math.abs(x - r);
  const dt = Math.abs(y - t);
  const db = Math.abs(y - b);
  const m = Math.min(dl, dr, dt, db);

  if (m == dt) return { x: x, y: t };
  if (m == db) return { x: x, y: b };
  if (m == dl) return { x: l, y: y };
  return { x: r, y: y };
}
