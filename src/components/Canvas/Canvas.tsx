import './Canvas.css';
import React, { Component, MouseEvent, createRef, RefObject } from 'react';
import { State, reducer } from './state';
import { CanvasEl } from '../types';
import { getSVGCoords } from '../../utils/svg';
import { assertUnreachable } from '../../utils/typescript';
import { FState, createFState } from '../../domain/fstate';
import { SVGState } from '../SVGState/SVGState';
import { addState } from './actions';

type Props = {};

type CanvasElement = SVGElement & { dataset: { element: CanvasEl | undefined } };

export class Canvas extends Component<Props, State> {
  svgRef: RefObject<SVGSVGElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      fstates: []
    };
    this.svgRef = createRef();
  }

  handleClick = (event: MouseEvent<SVGSVGElement>) => {
    const target: CanvasElement = event.target as CanvasElement;
    const elementType: CanvasEl | undefined = target.dataset.element;

    if (!elementType) return;

    switch (elementType) {
      case CanvasEl.state:
        return;
      case CanvasEl.grid: {
        const point: SVGPoint = getSVGCoords(this.svgRef.current!, event);
        const fstate: FState = createFState(point);

        this.setState(reducer(this.state, addState(fstate)));
        return;
      }
      default:
        assertUnreachable(elementType);
    }
  };

  render() {
    return (
      <svg
        ref={this.svgRef}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        onClick={this.handleClick}
      >
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1" />
          </pattern>
        </defs>

        <rect
          data-element={CanvasEl.grid}
          className="grid"
          width="100%"
          height="100%"
          fill="url(#grid)"
        />

        {this.state.fstates.map(fstate => (
          <SVGState fstate={fstate} key={`${fstate.coords.x} ${fstate.coords.y}`} />
        ))}
      </svg>
    );
  }
}
