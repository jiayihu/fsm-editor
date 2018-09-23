import './Canvas.css';
import React, { Component, MouseEvent, createRef, RefObject, ReactNode } from 'react';
import { State, reducer } from './state';
import { ElementType } from '../types';
import { getSVGCoords } from '../../utils/svg';
import { assertUnreachable } from '../../utils/typescript';
import { FState, createFState, isSameFState } from '../../domain/fstate';
import { SVGState } from '../SVGState/SVGState';
import { addState, editState, resetState, setDragState } from './actions';

type Props = {};

type CanvasElement = SVGElement & { dataset: { element: ElementType | undefined } };

export class Canvas extends Component<Props, State> {
  svgRef: RefObject<SVGSVGElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      type: 'READONLY',
      fstates: []
    };
    this.svgRef = createRef();
  }

  getElementType(event: MouseEvent): ElementType | undefined {
    const target: CanvasElement = event.target as CanvasElement;

    return target.dataset.element;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown as any);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown as any);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        this.setState(reducer(this.state, resetState()));
        return;
    }
  };

  handleDblClick = (event: MouseEvent<SVGSVGElement>) => {
    const elementType: ElementType | undefined = this.getElementType(event);

    if (!elementType) return;

    switch (elementType) {
      case ElementType.state:
        return;
      case ElementType.grid: {
        const point: SVGPoint = getSVGCoords(this.svgRef.current!, event);
        const fstate: FState = createFState(point);

        this.setState(reducer(this.state, addState(fstate)));
        return;
      }
      default:
        assertUnreachable(elementType);
    }
  };

  handleDragStart = (event: MouseEvent, fstate: FState) => {
    const elementType: ElementType | undefined = this.getElementType(event);

    if (elementType === ElementType.state) {
      this.setState(reducer(this.state, setDragState(fstate, fstate.coords)));
    }
  };

  handleDragMove = (event: MouseEvent) => {
    if (!this.svgRef.current || this.state.type !== 'DRAGGING') return;

    const position = getSVGCoords(this.svgRef.current, event);

    this.setState(reducer(this.state, setDragState(this.state.fstate, position)));
  };

  handleDragEnd = () => {
    if (this.state.type !== 'DRAGGING') return;

    const fstate: FState = { ...this.state.fstate, coords: this.state.position };

    this.setState(reducer(this.state, editState(fstate)));
  };

  renderFStates(fstates: FState[]): ReactNode {
    return fstates.map(fstate => {
      const isDragged = this.state.type === 'DRAGGING' && isSameFState(fstate, this.state.fstate);

      return (
        <g
          onMouseDown={event => this.handleDragStart(event, fstate)}
          key={`${fstate.coords.x} ${fstate.coords.y}`}
        >
          <SVGState
            {...fstate}
            coords={
              this.state.type === 'DRAGGING' && isDragged ? this.state.position : fstate.coords
            }
            svgEl={this.svgRef.current}
            onTextChange={(text: string) =>
              this.setState(reducer(this.state, editState({ ...fstate, text })))
            }
          />
        </g>
      );
    });
  }

  render() {
    return (
      <svg
        ref={this.svgRef}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        onDoubleClick={this.handleDblClick}
        onMouseMove={this.handleDragMove}
        onMouseUp={this.handleDragEnd}
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
          data-element={ElementType.grid}
          className="grid"
          width="100%"
          height="100%"
          fill="url(#grid)"
        />

        {this.renderFStates(this.state.fstates)}
      </svg>
    );
  }
}
