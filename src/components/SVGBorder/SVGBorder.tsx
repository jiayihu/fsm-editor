import React, { Component, MouseEvent } from 'react';
import Radium from 'radium';
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

export const SVGBorder = Radium(
  class SVGBorder extends Component<Props, State> {
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
          onClick={this.props.onClick}
          rx={6}
          ry={6}
          style={styles.border}
        />
      );
    }
  }
);

const styles: RadiumStyle<'border'> = {
  border: {
    fill: ' none',
    pointerEvents: 'stroke',
    stroke: ' transparent',
    strokeWidth: ' 4px',
    transition: ' all var(--animation-duration-simple) var(--easing-standard)',

    ':hover': {
      stroke: 'rgb(var(--secondary))'
    }
  }
};
