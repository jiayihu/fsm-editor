import './Canvas.css';
import React, { Component, MouseEvent, createRef, RefObject, ReactNode } from 'react';
import classnames from 'classnames';
import { State, reducer } from './state';
import { ElementType } from '../types';
import { getSVGCoords, exportAsPNG, exportAsSVG } from '../../utils/svg';
import { assertUnreachable } from '../../utils/typescript';
import {
  FState,
  createFState,
  isSameFState,
  getTextWidth,
  getTextHeight
} from '../../domain/fstate';
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
import SVGGrid from '../SVGGrid/SVGGrid';

type Props = {};

type CanvasElement = SVGElement & { dataset: { element: ElementType | undefined } };

export class Canvas extends Component<Props, State> {
  static getDefs() {
    return (
      <g id="initial-arrow">
        <path d="M 0 0 l 30 0 m 0 -4 l 15 4 l -15 4 l 0 -8" />
      </g>
    );
  }

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

  handleFStateTextChange = (fstate: FState, text: string) => {
    const width = getTextWidth(text);
    const height = getTextHeight(text);

    const style: FState['style'] = {
      ...fstate.style,
      width,
      height
    };

    this.dispatch(editState({ ...fstate, style, text }));
  };

  handleTransitionClick = (ftransition: FTransition) => {
    if (this.state.type === 'DELETING') {
      return this.dispatch(deleteTransition(ftransition));
    }
  };

  handleExportAsSVG = () => {
    if (this.svgRef.current) exportAsSVG(this.svgRef.current);
  };

  handleExportAsPNG = () => {
    if (this.svgRef.current) exportAsPNG(this.svgRef.current);
  };

  renderInitialArrow({ coords, style }: FState) {
    const arrowWidth = 45; // see the <path>

    return (
      <use xlinkHref="#initial-arrow" x={coords.x - arrowWidth} y={coords.y + style.height / 2} />
    );
  }

  renderFStates(fstates: FState[]): ReactNode {
    return fstates.map((fstate, index) => {
      const coords = fstate.coords;
      const isDragged = this.state.type === 'DRAGGING' && isSameFState(fstate, this.state.fstate);
      const isDeleting = this.state.type === 'DELETING';

      return (
        <g
          onMouseDown={event => this.handleStateDragStart(event, fstate)}
          key={`${coords.x} ${coords.y}`}
        >
          {index === 0 ? this.renderInitialArrow(fstate) : null}
          <SVGState
            {...fstate}
            coords={this.state.type === 'DRAGGING' && isDragged ? this.state.position : coords}
            active={!isDragged && !isDeleting}
            svgEl={this.svgRef.current}
            onBorderClick={() => this.handleBorderClick(fstate)}
            onContentClick={() => this.handleContentClick(fstate)}
            onTextChange={text => this.handleFStateTextChange(fstate, text)}
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
      <>
        <div className="toolbar">
          <button className="toolbar__btn" onClick={this.handleExportAsSVG}>
            Export as SVG
          </button>
          <button className="toolbar__btn" onClick={this.handleExportAsPNG}>
            Export as PNG
          </button>
        </div>
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
            {SVGGrid.getDefs()}
            {Canvas.getDefs()}
            {SVGTransition.getDefs()}
          </defs>

          <SVGGrid />

          {this.renderFStates(this.state.fstates)}
          {this.renderFTransitions(this.state.ftransitions)}
          {this.renderDrawingLine()}
        </svg>
      </>
    );
  }
}
