import './SVGBorder.css';
import React, { Component, MouseEvent } from 'react';
import { ElementType } from '../types';
import { Point } from '../../domain/geometry';

type Props = {
  isDisabled?: boolean;
  coords: Point;
  width: number;
  height: number;
  onClick: (event: MouseEvent<SVGRectElement>) => void;
};

type State = {};

export class SVGBorder extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isDisabled, coords, width, height } = this.props;

    if (isDisabled) return null;

    return (
      <rect
        x={coords.x}
        y={coords.y}
        data-element={ElementType.border}
        width={width}
        height={height}
        className="border"
        onClick={this.props.onClick}
      />
    );
  }
}
