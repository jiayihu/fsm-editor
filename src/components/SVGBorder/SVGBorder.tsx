import './SVGBorder.css';
import React, { Component, MouseEvent } from 'react';
import { FState } from '../../domain/fstate';
import { ElementType } from '../types';

type Props = {
  fstate: FState;
  onClick: (event: MouseEvent<SVGRectElement>, fstate: FState) => void;
};

type State = {};

export class SVGBorder extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleClick = (event: MouseEvent<SVGRectElement>) => {
    this.props.onClick(event, this.props.fstate);
  };

  render() {
    const { fstate } = this.props;
    const { coords, style } = fstate;

    return (
      <rect
        x={coords.x}
        y={coords.y}
        data-element={ElementType.border}
        width={style.width}
        height={style.height}
        className="border"
        onClick={this.handleClick}
      />
    );
  }
}
