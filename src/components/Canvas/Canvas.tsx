import './Canvas.css';
import React, { Component, MouseEvent, createRef, RefObject, ReactNode } from 'react';
import { State, reducer } from './state';
import { ElementType } from '../types';
import { getSVGCoords } from '../../utils/svg';
import { assertUnreachable } from '../../utils/typescript';
import { FState, createFState, isSameFState } from '../../domain/fstate';
import { SVGState } from '../SVGState/SVGState';
import { SVGBorder } from '../SVGBorder/SVGBorder';
import {
  addState,
  editState,
  resetState,
  setDragState,
  setLineState,
  addTransition
} from './actions';
import SVGTransition from '../SVGTransition/SVGTransition';
import { createFTransition, FTransition } from '../../domain/transition';
import { getNearestPointInPerimeter } from '../../utils/math/getNearestPointInPerimeter';

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

  handleClick = (_: MouseEvent<SVGSVGElement>) => {
    // Noop
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

  handleBorderClick = (event: MouseEvent<SVGRectElement>, fstate: FState) => {
    if (this.state.type !== 'DRAWING_LINE') {
      return this.setState(reducer(this.state, setLineState(fstate, fstate.coords)));
    }

    // Check if the clicked state, while drawing a transition, is not the origin state
    if (fstate !== this.state.fstate) {
      const ftransition = createFTransition(this.state.fstate, fstate);

      return this.setState(reducer(this.state, addTransition(ftransition)));
    }
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
          {this.state.type !== 'DRAGGING' && (
            <SVGBorder fstate={fstate} onClick={this.handleBorderClick} />
          )}
        </g>
      );
    });
  }

  renderFTransitions(ftransitions: FTransition[]): ReactNode {
    return ftransitions.map(ftransition => {
      if (this.state.type === 'DRAGGING') {
        const { position } = this.state;
        const isFrom = isSameFState(ftransition.fromState, this.state.fstate);
        const isTo = isSameFState(ftransition.toState, this.state.fstate);

        if (isFrom || isTo) {
          if (isFrom) {
            /** @TODO: refactoring as extracted utility */
            const fromPosition = getNearestPointInPerimeter(
              position.x,
              position.y,
              ftransition.fromState.style.width,
              ftransition.fromState.style.height,
              ftransition.toState.coords.x,
              ftransition.toState.coords.y
            );
            const toPosition = getNearestPointInPerimeter(
              ftransition.toState.coords.x,
              ftransition.toState.coords.y,
              ftransition.fromState.style.width,
              ftransition.fromState.style.height,
              fromPosition.x,
              fromPosition.y
            );

            return (
              <SVGTransition
                type="DRAWING"
                fromPosition={fromPosition}
                toPosition={toPosition}
                key={ftransition.id}
              />
            );
          }

          if (isTo) {
            const toPosition = getNearestPointInPerimeter(
              position.x,
              position.y,
              ftransition.toState.style.width,
              ftransition.toState.style.height,
              ftransition.fromState.coords.x,
              ftransition.fromState.coords.y
            );
            const fromPosition = getNearestPointInPerimeter(
              ftransition.fromState.coords.x,
              ftransition.fromState.coords.y,
              ftransition.fromState.style.width,
              ftransition.fromState.style.height,
              toPosition.x,
              toPosition.y
            );

            return (
              <SVGTransition
                type="DRAWING"
                fromPosition={fromPosition}
                toPosition={toPosition}
                key={ftransition.id}
              />
            );
          }
        }
      }

      return <SVGTransition type="READONLY" ftransition={ftransition} key={ftransition.id} />;
    });
  }

  renderDrawingLine() {
    if (this.state.type !== 'DRAWING_LINE') return null;

    const { fstate, position } = this.state;

    const fromPosition = getNearestPointInPerimeter(
      fstate.coords.x,
      fstate.coords.y,
      fstate.style.width,
      fstate.style.height,
      position.x,
      position.y
    );

    return <SVGTransition type="DRAWING" fromPosition={fromPosition} toPosition={position} />;
  }

  render() {
    return (
      <svg
        className="canvas"
        ref={this.svgRef}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        onClick={this.handleClick}
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
        {this.renderFTransitions(this.state.ftransitions)}
        {this.renderDrawingLine()}
      </svg>
    );
  }
}
