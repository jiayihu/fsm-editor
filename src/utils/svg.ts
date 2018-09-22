import { MouseEvent } from 'react';

/**
 * Returns SVG coordinates of a click event
 * @see {@link https://stackoverflow.com/questions/29261304/how-to-get-the-click-coordinates-relative-to-svg-element-holding-the-onclick-lis}
 */
export function getSVGCoords(svg: SVGSVGElement, event: MouseEvent): SVGPoint {
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;

  // The cursor point, translated into svg coordinates
  return pt.matrixTransform(svg.getScreenCTM()!.inverse());
}
