import './SVGTransition.css';
import React, { Component, ReactNode } from 'react';
import { FTransition } from '../../domain/transition';
import { getNearestPointInPerimeter } from '../../utils/math/getNearestPointInPerimeter';
import { Point } from '../../domain/point';

type Props =
  | { type: 'DRAWING'; fromPosition: Point; toPosition: Point }
  | {
      type: 'READONLY';
      ftransition: FTransition;
    };

export default class SVGTransition extends Component<Props> {
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
      <line
        className="ftransition"
        x1={fromPosition.x}
        y1={fromPosition.y}
        x2={toPosition.x}
        y2={toPosition.y}
      />
    );
  }

  renderDrawingLine(): ReactNode {
    if (this.props.type !== 'DRAWING') return null;

    const { fromPosition, toPosition } = this.props;

    return (
      <line
        className="ftransition ftransition--drawing"
        x1={fromPosition.x}
        y1={fromPosition.y}
        x2={toPosition.x}
        y2={toPosition.y}
      />
    );
  }

  render() {
    return this.props.type === 'READONLY' ? this.renderTransition() : this.renderDrawingLine();
  }
}
