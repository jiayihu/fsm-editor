import './Canvas.css';
import React, { Component, MouseEvent, createRef, RefObject, ReactNode } from 'react';
import classnames from 'classnames';
import { State, reducer } from './state';
import { ElementType } from '../types';
import { getSVGCoords } from '../../utils/svg';
import { assertUnreachable } from '../../utils/typescript';
import { FState, createFState, isSameFState } from '../../domain/fstate';
import { SVGState } from '../SVGState/SVGState';
import {
  addState,
  editState,
  resetState,
  setDragState,
  setLineState,
  addTransition,
  Action,
  deleteState,
  setDeleteState,
  deleteTransition
} from './actions';
import SVGTransition from '../SVGTransition/SVGTransition';
import { createFTransition, FTransition } from '../../domain/transition';
import { getNearestPointInPerimeter } from '../../utils/math/getNearestPointInPerimeter';
import { Point } from '../../domain/geometry';

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

  dispatch(action: Action) {
    this.setState(state => reducer(state, action));
  }

  getElementType(event: MouseEvent): ElementType | undefined {
    const target: CanvasElement = event.target as CanvasElement;

    return target.dataset.element;
  }

  getLineOfMovingState(position: Point, movingState: FState, staticState: FState) {
    const start = getNearestPointInPerimeter(
      position.x,
      position.y,
      movingState.style.width,
      movingState.style.height,
      staticState.coords.x,
      staticState.coords.y
    );
    const end = getNearestPointInPerimeter(
      staticState.coords.x,
      staticState.coords.y,
      staticState.style.width,
      staticState.style.height,
      start.x,
      start.y
    );

    return { start, end };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown as any);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown as any);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Backspace':
        this.dispatch(setDeleteState());
        return;
      case 'Escape':
        this.dispatch(resetState());
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

        this.dispatch(addState(fstate));
        return;
      }
      default:
        assertUnreachable(elementType);
    }
  };

  handleStateDragStart = (event: MouseEvent, fstate: FState) => {
    if (this.state.type === 'DELETING') return;

    const elementType: ElementType | undefined = this.getElementType(event);

    if (elementType === ElementType.state) {
      this.dispatch(setDragState(fstate, fstate.coords));
    }
  };

  handleMouseMove = (event: MouseEvent) => {
    if (!this.svgRef.current) return;

    if (this.state.type === 'DRAGGING') {
      const position = getSVGCoords(this.svgRef.current, event);
      this.dispatch(setDragState(this.state.fstate, position));
    }

    if (this.state.type === 'DRAWING_LINE') {
      const position = getSVGCoords(this.svgRef.current, event);
      this.dispatch(setLineState(this.state.fstate, position));
    }
  };

  handleMouseUp = () => {
    if (this.state.type === 'DRAGGING') {
      const fstate: FState = { ...this.state.fstate, coords: this.state.position };
      this.dispatch(editState(fstate));
    }
  };

  handleMouseLeave = () => {
    this.dispatch(resetState());
  };

  handleBorderClick = (fstate: FState) => {
    if (this.state.type !== 'DRAWING_LINE') {
      return this.dispatch(setLineState(fstate, fstate.coords));
    }

    // Check if the clicked state, while drawing a transition, is not the origin state
    if (fstate !== this.state.fstate) {
      const ftransition = createFTransition(this.state.fstate, fstate);

      return this.dispatch(addTransition(ftransition));
    }
  };

  handleContentClick = (fstate: FState) => {
    if (this.state.type === 'DELETING') {
      return this.dispatch(deleteState(fstate));
    }
  };

  handleTransitionClick = (ftransition: FTransition) => {
    if (this.state.type === 'DELETING') {
      return this.dispatch(deleteTransition(ftransition));
    }
  };

  renderFStates(fstates: FState[]): ReactNode {
    return fstates.map(fstate => {
      const isDragged = this.state.type === 'DRAGGING' && isSameFState(fstate, this.state.fstate);
      const isDeleting = this.state.type === 'DELETING';

      return (
        <g
          onMouseDown={event => this.handleStateDragStart(event, fstate)}
          key={`${fstate.coords.x} ${fstate.coords.y}`}
        >
          <SVGState
            {...fstate}
            coords={
              this.state.type === 'DRAGGING' && isDragged ? this.state.position : fstate.coords
            }
            active={!isDragged && !isDeleting}
            svgEl={this.svgRef.current}
            onBorderClick={() => this.handleBorderClick(fstate)}
            onContentClick={() => this.handleContentClick(fstate)}
            onTextChange={(text: string) => this.dispatch(editState({ ...fstate, text }))}
          />
        </g>
      );
    });
  }

  renderFTransitions(ftransitions: FTransition[]): ReactNode {
    return ftransitions.map(ftransition => {
      if (this.state.type === 'DRAGGING') {
        const { position } = this.state;
        const { fromState, toState } = ftransition;
        const isFrom = isSameFState(fromState, this.state.fstate);
        const isTo = isSameFState(toState, this.state.fstate);

        if (isFrom || isTo) {
          const movingState = isFrom ? fromState : toState;
          const staticState = isFrom ? toState : fromState;
          const { start, end } = this.getLineOfMovingState(position, movingState, staticState);

          return (
            <SVGTransition
              type="DRAWING"
              fromPosition={isFrom ? start : end}
              toPosition={isFrom ? end : start}
              key={ftransition.id}
            />
          );
        }
      }

      return (
        <SVGTransition
          type="READONLY"
          active={this.state.type !== 'DELETING'}
          ftransition={ftransition}
          key={ftransition.id}
          onClick={() => this.handleTransitionClick(ftransition)}
        />
      );
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
    const className = classnames('canvas', {
      [`is-${this.state.type.toLowerCase()}`]: true
    });

    return (
      <svg
        className={className}
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
            refX="10"
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
