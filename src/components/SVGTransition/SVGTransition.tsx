import './SVGTransition.css';
import React, { Component, ReactNode } from 'react';
import { FTransition } from '../../domain/transition';
import { FState } from '../../domain/fstate';
import { getNearestPointInPerimeter } from '../../utils/math/getNearestPointInPerimeter';

type Props =
  | { type: 'DRAWING'; fstate: FState; position: SVGPoint }
  | {
      type: 'READONLY';
      ftransition: FTransition;
    };

export default class SVGTransition extends Component<Props> {
  renderTransition(): ReactNode {
    if (this.props.type !== 'READONLY') return null;

    const ftransition = this.props.ftransition;
    const { fromState, toState } = ftransition;

    return (
      <line
        className="ftransition"
        x1={fromState.coords.x}
        y1={fromState.coords.y}
        x2={toState.coords.x}
        y2={toState.coords.y}
      />
    );
  }

  renderDrawingLine(): ReactNode {
    if (this.props.type !== 'DRAWING') return null;

    const { fstate, position } = this.props;
    const {
      coords,
      style: { width, height }
    } = fstate;

    const origin = getNearestPointInPerimeter(
      coords.x,
      coords.y,
      width,
      height,
      position.x,
      position.y
    );

    return (
      <line className="ftransition" x1={origin.x} y1={origin.y} x2={position.x} y2={position.y} />
    );
  }

  render() {
    return this.props.type === 'READONLY' ? this.renderTransition() : this.renderDrawingLine();
  }
}
