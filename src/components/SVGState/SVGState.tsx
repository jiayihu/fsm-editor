import './SVGState.css';
import React, { Component, ReactNode, KeyboardEvent, ChangeEvent, MouseEvent } from 'react';
import classnames from 'classnames';
import { FState } from '../../domain/fstate';
import { ElementType } from '../types';
import { SVGBorder } from '../SVGBorder/SVGBorder';

type Props = FState & {
  active: boolean;
  svgEl: SVGSVGElement | null;
  onBorderClick: (event: MouseEvent<SVGRectElement>) => void;
  onContentClick: (event: MouseEvent<SVGRectElement>) => void;
  onTextChange: (text: string) => void;
};

type State =
  | { type: 'READONLY' }
  | {
      type: 'EDITING';
      text: string;
    };

export class SVGState extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { type: 'READONLY' };
  }

  handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        this.setState({ type: 'READONLY' });
        return;
      case 'Enter':
        this.handleTextBlur();
        return;
    }
  };

  handleDblClick = () => {
    if (!this.props.active) return;

    this.setState({ type: 'EDITING', text: this.props.text });
  };

  handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ type: 'EDITING', text: event.target.value });
  };

  handleTextBlur = () => {
    if (this.state.type !== 'EDITING') return;

    this.props.onTextChange(this.state.text);
    this.setState({ type: 'READONLY' });
  };

  renderText(): ReactNode {
    switch (this.state.type) {
      case 'READONLY':
        return <span onDoubleClick={this.handleDblClick}>{this.props.text}</span>;
      case 'EDITING':
        return (
          <input
            autoFocus
            className="fstate__input"
            type="text"
            value={this.state.text}
            onChange={this.handleTextChange}
            onBlur={this.handleTextBlur}
          />
        );
    }
  }

  render() {
    const { active, coords, style } = this.props;
    const className = classnames('fstate', {
      'is-active': active
    });

    return (
      <g className={className} onKeyDown={this.handleKeyDown} onClick={this.props.onContentClick}>
        <rect
          x={coords.x}
          y={coords.y}
          data-element={ElementType.state}
          width={style.width}
          height={style.height}
          className="fstate__rect"
        />
        {active && (
          <SVGBorder
            coords={coords}
            width={style.width}
            height={style.height}
            onClick={this.props.onBorderClick}
          />
        )}

        <foreignObject
          x={coords.x}
          y={coords.y + (style.height - style.fontSize) / 2}
          width="100"
          height={style.fontSize}
          xmlns="http://www.w3.org/1999/xhtml"
        >
          <div className="fstate__text">{this.renderText()}</div>
        </foreignObject>
      </g>
    );
  }
}
