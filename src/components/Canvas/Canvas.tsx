import './Canvas.css';
import React, { Component, MouseEvent, createRef, RefObject, ReactNode } from 'react';
import { State, reducer } from './state';
import { ElementType } from '../types';
import { getSVGCoords } from '../../utils/svg';
import { assertUnreachable } from '../../utils/typescript';
import { FState, createFState, isSameFState } from '../../domain/fstate';
import { SVGState } from '../SVGState/SVGState';
import { SVGBorder } from '../SVGBorder/SVGBorder';
import { addState, editState, resetState, setDragState, setLineState } from './actions';
import SVGTransition from '../SVGTransition/SVGTransition';

type Props = {};

type CanvasElement = SVGElement & { dataset: { element: ElementType | undefined } };

export class Canvas extends Component<Props, State> {
  svgRef: RefObject<SVGSVGElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      type: 'READONLY',
      fstates: [],
      ftransitions: []
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
      case ElementType.border:
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

  handleMouseDown = (event: MouseEvent, fstate: FState) => {
    const elementType: ElementType | undefined = this.getElementType(event);

    if (elementType === ElementType.state) {
      this.setState(reducer(this.state, setDragState(fstate, fstate.coords)));
    }
  };

  handleMouseMove = (event: MouseEvent) => {
    if (!this.svgRef.current) return;

    if (this.state.type === 'DRAGGING') {
      const position = getSVGCoords(this.svgRef.current, event);
      this.setState(reducer(this.state, setDragState(this.state.fstate, position)));
    }

    if (this.state.type === 'DRAWING_LINE') {
      const position = getSVGCoords(this.svgRef.current, event);
      this.setState(reducer(this.state, setLineState(this.state.fstate, position)));
    }
  };

  handleMouseUp = () => {
    if (this.state.type === 'DRAGGING') {
      const fstate: FState = { ...this.state.fstate, coords: this.state.position };
      this.setState(reducer(this.state, editState(fstate)));
    }
  };

  handleMouseLeave = () => {
    this.setState(reducer(this.state, resetState()));
  };

  handleTransitionStart = (_: MouseEvent<SVGRectElement>, fstate: FState) => {
    this.setState(reducer(this.state, setLineState(fstate, fstate.coords)));
  };

  renderFStates(fstates: FState[]): ReactNode {
    return fstates.map(fstate => {
      const isDragged = this.state.type === 'DRAGGING' && isSameFState(fstate, this.state.fstate);

      return (
        <g
          onMouseDown={event => this.handleMouseDown(event, fstate)}
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
          <SVGBorder fstate={fstate} onClick={this.handleTransitionStart} />
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
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseLeave}
      >
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1" />
          </pattern>

          <marker
            id="marker-arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>

        <rect
          data-element={ElementType.grid}
          className="grid"
          width="100%"
          height="100%"
          fill="url(#grid)"
        />

        {this.renderFStates(this.state.fstates)}
        {this.state.type === 'DRAWING_LINE' ? (
          <SVGTransition type="DRAWING" fstate={this.state.fstate} position={this.state.position} />
        ) : null}
      </svg>
    );
  }
}
