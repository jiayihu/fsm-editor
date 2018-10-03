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

const NOT_EXPORTED = 'js-not-exported';

function prepareSVG(svg: SVGSVGElement): SVGSVGElement {
  const cloneSvg = svg.cloneNode(true) as SVGSVGElement;
  inlineSVGStyles(cloneSvg, svg);

  cloneSvg.querySelectorAll(`.${NOT_EXPORTED}`).forEach(el => el.parentNode!.removeChild(el));

  return cloneSvg;
}

function inlineSVGStyles(clone: SVGElement, source: SVGElement) {
  const containerElements = ['svg', 'defs', 'pattern', 'marker', 'g'];
  const relevantStyles: { [tagName: string]: string[] } = {
    rect: ['fill', 'stroke', 'stroke-width', 'rx', 'ry'],
    path: ['fill', 'stroke', 'stroke-width'],
    circle: ['fill', 'stroke', 'stroke-width'],
    line: ['stroke', 'stroke-width', 'marker-end'],
    text: ['fill', 'font-size', 'text-anchor'],
    polygon: ['stroke', 'fill']
  };

  function traverse(clone: SVGElement, source: SVGElement) {
    const children = (clone.childNodes as any) as SVGElement[];
    const sourceChildren = (source.childNodes as any) as SVGElement[];

    children.forEach((child, index) => {
      const tagName = child.tagName;

      if (containerElements.includes(tagName)) {
        traverse(child, sourceChildren[index]);
      } else if (relevantStyles[tagName]) {
        const styleDecl = window.getComputedStyle(sourceChildren[index]);
        const styleString = relevantStyles[tagName].reduce((acc, style) => {
          return (acc += `${style}: ${styleDecl.getPropertyValue(style)};`);
        }, '');

        child.setAttribute('style', styleString);
      }
    });
  }

  traverse(clone, source);
}

function triggerDownload(url: string, filename: string) {
  const evt = new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true
  });

  const anchor = document.createElement('a');
  anchor.setAttribute('download', filename);
  anchor.setAttribute('href', url);
  anchor.setAttribute('target', '_blank');

  anchor.dispatchEvent(evt);
}

export function exportAsSVG(svg: SVGSVGElement) {
  const cloneSvg = prepareSVG(svg);

  const svgData = cloneSvg.outerHTML;
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  triggerDownload(svgUrl, 'fsm.svg');
}

export function exportAsPNG(svg: SVGSVGElement) {
  const cloneSvg = prepareSVG(svg);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const svgString = new XMLSerializer().serializeToString(cloneSvg);

  const img = new Image();
  const url = `data:image/svg+xml;base64,${window.btoa(svgString)}`;

  const svgRect = svg.getBBox();
  canvas.width = svgRect.width;
  canvas.height = svgRect.height;

  img.crossOrigin = 'anonymous';
  img.onload = function() {
    ctx.drawImage(img, 0, 0);

    const imgURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');

    triggerDownload(imgURI, 'fsm.png');
  };

  img.src = url;
}
