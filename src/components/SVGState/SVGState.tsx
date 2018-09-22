import './SVGState.css';
import React, { Component, createElement } from 'react';
import { FState } from '../../domain/fstate';
import { ELEMENT } from '../types';

type Props = {
  fstate: FState;
};

export default class SVGState extends Component<Props> {
  render() {
    const { fstate } = this.props;
    const { coords, text, style } = fstate;
    const textEl = createElement(
      'div',
      { className: 'fstate__text', xmlns: 'http://www.w3.org/1999/xhtml' },
      text
    );

    return (
      <g className="fstate">
        <rect
          x={coords.x}
          y={coords.y}
          data-element={ELEMENT.state}
          width={style.width}
          height={style.height}
          className="fstate__rect"
        />
        <foreignObject
          x={coords.x}
          y={coords.y + (style.height - style.fontSize) / 2}
          width="100"
          height={style.fontSize}
        >
          {textEl}
        </foreignObject>
      </g>
    );
  }
}
