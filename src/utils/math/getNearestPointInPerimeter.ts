import { createPoint, Point } from '../../domain/point';

export function getNearestPointInPerimeter(
  l: number,
  t: number,
  w: number,
  h: number,
  x: number,
  y: number
): Point {
  const midW = w / 2;
  const midH = h / 2;

  const anchors: [number, number][] = [
    [l + midW, t],
    [l, t + midH],
    [l + w, t + midH],
    [l + midW, t + h]
  ];
  const distances = anchors.map(([x1, y1]) => Math.sqrt((x - x1) ** 2 + (y - y1) ** 2));
  const nearestIndex = distances.indexOf(Math.min(...distances));
  const point = anchors[nearestIndex];

  return createPoint(point[0], point[1]);
}
