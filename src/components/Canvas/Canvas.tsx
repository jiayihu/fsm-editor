import React, { Component, MouseEvent, createRef, RefObject, ReactNode } from 'react';
import Radium from 'radium';
import { State, reducer } from './state';
import { ElementType } from '../types';
import { getSVGCoords, exportAsPNG, exportAsSVG } from '../../utils/svg';
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
  deleteTransition,
  setEditingState,
  editTransition
} from './actions';
import { SVGTransition } from '../SVGTransition/SVGTransition';
import { createFTransition, FTransition } from '../../domain/transition';
import { getNearestPointInPerimeter } from '../../utils/math/getNearestPointInPerimeter';
import { Point } from '../../domain/geometry';
import { SVGGrid } from '../SVGGrid/SVGGrid';
import { asCSS } from '../../utils/radium';
import { theme } from '../../css/theme';

type Props = {};

type CanvasElement = SVGElement & { dataset: { element: ElementType | undefined } };

export const Canvas = Radium(
  class Canvas extends Component<Props, State> {
    static getDefs() {
      return (
        <g id="initial-arrow">
          <path d="M 0 0 l 30 0 m 0 -4 l 15 4 l -15 4 l 0 -8" style={styles.initialArrow} />
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
          if (this.state.type !== 'EDITING') this.dispatch(setDeleteState());
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
      // this.dispatch(resetState());
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

    handleEditStart = () => this.dispatch(setEditingState());

    handleFStateEditEnd = (fstate: FState, text: string, width: number, height: number) => {
      const style: FState['style'] = {
        ...fstate.style,
        width,
        height
      };

      this.dispatch(editState({ ...fstate, style, text }));
    };

    handleFTransitionEditEnd = (ftransition: FTransition, text: string) => {
      this.dispatch(editTransition({ ...ftransition, text }));
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
              fstate={
                this.state.type === 'DRAGGING' && isDragged
                  ? { ...fstate, coords: this.state.position }
                  : fstate
              }
              active={!isDragged && !isDeleting}
              svgEl={this.svgRef.current}
              onBorderClick={() => this.handleBorderClick(fstate)}
              onContentClick={() => this.handleContentClick(fstate)}
              onEditStart={this.handleEditStart}
              onEditEnd={(text, width, height) =>
                this.handleFStateEditEnd(fstate, text, width, height)
              }
              style={isDeleting ? styles.isDeletingChild : undefined}
            />
          </g>
        );
      });
    }

    renderFTransitions(ftransitions: FTransition[]): ReactNode {
      const isDeleting = this.state.type === 'DELETING';

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
            onEditStart={this.handleEditStart}
            onEditEnd={text => this.handleFTransitionEditEnd(ftransition, text)}
            style={isDeleting ? styles.isDeletingChild : undefined}
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
      return (
        <>
          <div style={styles.toolbar}>
            <button
              onClick={this.handleExportAsSVG}
              style={asCSS([styles.toolbarBtn, { marginRight: theme.spacing.medium }])}
              key="radium-btn-1"
            >
              Export as SVG
            </button>
            <button onClick={this.handleExportAsPNG} style={styles.toolbarBtn} key="radium-btn-2">
              Export as PNG
            </button>
          </div>
          <svg
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
            style={styles.canvas}
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
);

const styles: RadiumStyle<
  'canvas' | 'toolbar' | 'toolbarBtn' | 'initialArrow' | 'isDeletingChild'
> = {
  canvas: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    overflow: 'auto',
    userSelect: 'none' /* Disables text selection when dragging */
  },
  toolbar: {
    backgroundColor: theme.colors.primary,
    paddingBottom: theme.spacing.medium,
    textAlign: 'center'
  },
  toolbarBtn: {
    backgroundColor: '#fff',
    borderColor: '#dbdbdb',
    borderWidth: '1px',
    color: '#363636',
    cursor: 'pointer',
    justifyContent: 'center',
    paddingBottom: 'calc(0.375em - 1px)',
    paddingLeft: '0.75em',
    paddingRight: '0.75em',
    paddingTop: 'calc(0.375em - 1px)',
    textAlign: 'center',
    whiteSpace: 'nowrap',

    ':hover': {
      borderColor: '#b5b5b5',
      color: '#363636'
    }
  },
  initialArrow: {
    fill: theme.colors.primaryVariant,
    stroke: theme.colors.primaryVariant,
    strokeWidth: '2px'
  },

  isDeletingChild: {
    cursor: 'pointer'
  }
};
