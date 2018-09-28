import './SVGBorder.css';
import React, { Component, MouseEvent } from 'react';
import { ElementType } from '../types';
import { Point } from '../../domain/geometry';
import { noop } from '../../utils/generic';

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

  handleClick = (event: MouseEvent<SVGRectElement>) => {
    this.props.isDisabled ? noop() : this.props.onClick(event);
  };

  render() {
    const { coords, width, height } = this.props;

    return (
      <rect
        x={coords.x}
        y={coords.y}
        data-element={ElementType.border}
        width={width}
        height={height}
        className="border"
        onClick={this.handleClick}
      />
    );
  }
}
