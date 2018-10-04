import React, { Component, ReactNode, MouseEvent, CSSProperties, ChangeEvent } from 'react';
import Radium from 'radium';
import { FTransition } from '../../domain/transition';
import { getNearestPointInPerimeter } from '../../utils/math/getNearestPointInPerimeter';
import { Point } from '../../domain/geometry';
import { asCSS } from '../../utils/radium';

type Props =
  | { type: 'DRAWING'; fromPosition: Point; toPosition: Point; style?: CSSProperties }
  | {
      type: 'READONLY';
      active: boolean;
      ftransition: FTransition;
      style?: CSSProperties;
      onClick: (event: MouseEvent<SVGLineElement>) => void;
      onEditStart: () => void;
      onEditEnd: (text: string) => void;
    };

type State =
  | { type: 'READONLY' }
  | {
      type: 'EDITING';
      text: string;
    };

export const SVGTransition = Radium(
  class SVGTransition extends Component<Props, State> {
    static getDefs() {
      return (
        <marker
          id="marker-arrow"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" style={styles.markerArrow} />
        </marker>
      );
    }

    constructor(props: Props) {
      super(props);
      this.state = {
        type: 'READONLY'
      };
    }

    handleDblClick = () => {
      if (this.props.type !== 'READONLY') return;

      const {
        ftransition: { text }
      } = this.props;

      this.props.onEditStart();
      this.setState({ type: 'EDITING', text });
    };

    handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      this.setState({ type: 'EDITING', text: event.target.value });
    };

    handleTextBlur = () => {
      if (this.props.type !== 'READONLY' || this.state.type !== 'EDITING') return;

      this.setState({ type: 'READONLY' });
      this.props.onEditEnd(this.state.text);
    };

    renderText(): ReactNode {
      if (this.props.type !== 'READONLY') return null;

      switch (this.state.type) {
        case 'READONLY':
          return (
            <span onDoubleClick={this.handleDblClick} style={styles.readonlyText}>
              {this.props.ftransition.text}
            </span>
          );
        case 'EDITING':
          return (
            <textarea
              autoFocus
              value={this.state.text}
              onChange={this.handleTextChange}
              onBlur={this.handleTextBlur}
              style={styles.input}
            />
          );
      }
    }

    renderForeignObject(fromPosition: Point, toPosition: Point): ReactNode {
      if (this.props.type !== 'READONLY') return null;

      const width = Math.abs(toPosition.x - fromPosition.x);
      const height = Math.abs(toPosition.y - fromPosition.y);
      const x = Math.min(fromPosition.x, toPosition.x);
      const y = Math.min(fromPosition.y, toPosition.y);

      return (
        <foreignObject x={x} y={y} width={width} height={height}>
          <div {...{ xmlns: 'http://www.w3.org/1999/xhtml' }} style={styles.text}>
            {this.renderText()}
          </div>
        </foreignObject>
      );
    }

    renderTransition(): ReactNode {
      if (this.props.type !== 'READONLY') return null;

      const ftransition = this.props.ftransition;
      const { fromState, toState } = ftransition;

      const fromPosition = getNearestPointInPerimeter(
        fromState.coords.x,
        fromState.coords.y,
        fromState.style.width,
        fromState.style.height,
        toState.coords.x,
        toState.coords.y
      );
      const toPosition = getNearestPointInPerimeter(
        toState.coords.x,
        toState.coords.y,
        toState.style.width,
        toState.style.height,
        fromPosition.x,
        fromPosition.y
      );

      return (
        <g>
          <line
            x1={fromPosition.x}
            y1={fromPosition.y}
            x2={toPosition.x}
            y2={toPosition.y}
            onClick={this.props.onClick}
            style={asCSS([styles.ftransition, this.props.style])}
          />
          {this.renderForeignObject(fromPosition, toPosition)}
        </g>
      );
    }

    renderDrawingLine(): ReactNode {
      if (this.props.type !== 'DRAWING') return null;

      const { fromPosition, toPosition, style } = this.props;

      return (
        <line
          x1={fromPosition.x}
          y1={fromPosition.y}
          x2={toPosition.x}
          y2={toPosition.y}
          style={asCSS([styles.ftransition, styles.isDrawingFtransition, style])}
        />
      );
    }

    render() {
      return this.props.type === 'READONLY' ? this.renderTransition() : this.renderDrawingLine();
    }
  }
);

const styles: RadiumStyle<
  'ftransition' | 'text' | 'readonlyText' | 'input' | 'markerArrow' | 'isDrawingFtransition'
> = {
  ftransition: {
    markerEnd: 'url(#marker-arrow)',
    stroke: 'rgb(var(--secondary))',
    strokeWidth: '2px'
  },
  text: {
    height: '100%',
    lineHeight: '1',
    whiteSpace: 'pre-wrap',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  readonlyText: {
    backgroundColor: 'rgb(var(--surface))'
  },
  /** @TODO: share input styles */
  input: {
    appearance: 'none',
    backgroundColor: '#fff',
    border: 'none',
    boxShadow: 'none',
    color: 'inherit',
    lineHeight: '1',
    padding: '1rem',
    position: 'relative',
    textAlign: 'center',
    verticalAlign: 'top'
  },
  markerArrow: {
    fill: 'rgb(var(--secondary-variant))'
  },

  isDrawingFtransition: {
    pointerEvents: 'none'
  }
};
