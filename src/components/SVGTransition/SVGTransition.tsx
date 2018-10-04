import React, { Component, ReactNode, MouseEvent, CSSProperties } from 'react';
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

    renderText(fromPosition: Point, toPosition: Point): ReactNode {
      if (this.props.type !== 'READONLY') return null;

      const width = Math.abs(toPosition.x - fromPosition.x);
      const height = Math.abs(toPosition.y - fromPosition.y);

      return (
        <foreignObject x={fromPosition.x} y={fromPosition.y} width={width} height={height}>
          <div {...{ xmlns: 'http://www.w3.org/1999/xhtml' }} style={styles.text}>
            {this.props.ftransition.text}
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
          {this.renderText(fromPosition, toPosition)}
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

const styles: RadiumStyle<'ftransition' | 'text' | 'markerArrow' | 'isDrawingFtransition'> = {
  ftransition: {
    markerEnd: 'url(#marker-arrow)',
    stroke: 'rgb(var(--secondary))',
    strokeWidth: '2px'
  },
  text: {
    height: '100%',
    lineHeight: '1',
    whiteSpace: 'pre-wrap'
  },
  markerArrow: {
    fill: 'rgb(var(--secondary-variant))'
  },

  isDrawingFtransition: {
    pointerEvents: 'none'
  }
};
