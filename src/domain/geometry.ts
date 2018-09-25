export type Point = {
  x: number;
  y: number;
};

export function createPoint(x: number, y: number): Point {
  return { x, y };
}

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
