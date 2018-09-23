import './SVGState.css';
import React, { Component, createElement, ReactNode, ChangeEvent } from 'react';
import { FState } from '../../domain/fstate';
import { CanvasEl } from '../types';

type Props = {
  fstate: FState;
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

  handleDblClick = () => {
    this.setState({ type: 'EDITING', text: this.props.fstate.text });
  };

  handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ type: 'EDITING', text: event.target.value });
  };

  handleTextBlur = () => {
    if (this.state.type !== 'EDITING') return;

    this.props.onTextChange(this.state.text);
    this.setState({ type: 'READONLY' });
  };

  renderStaticText(text: string): ReactNode {
    return <span onDoubleClick={this.handleDblClick}>{text}</span>;
  }

  renderEditingText(text: string): ReactNode {
    return (
      <input
        autoFocus
        className="fstate__input"
        type="text"
        value={text}
        onChange={this.handleTextChange}
        onBlur={this.handleTextBlur}
      />
    );
  }

  render() {
    const { fstate } = this.props;
    const { coords, text, style } = fstate;
    // Use `createElement` because TS doesn't allow `xmlsn` on div
    const textEl = createElement(
      'div',
      { className: 'fstate__text', xmlns: 'http://www.w3.org/1999/xhtml' },
      this.state.type === 'READONLY'
        ? this.renderStaticText(text)
        : this.renderEditingText(this.state.text)
    );

    return (
      <g className="fstate">
        <rect
          x={coords.x}
          y={coords.y}
          data-element={CanvasEl.state}
          width={style.width}
          height={style.height}
          className="fstate__rect"
        />
        <foreignObject
          x={coords.x}
          y={coords.y + (style.height - style.fontSize) / 2}
          width="100"
          height={style.fontSize}
        >
          {textEl}
        </foreignObject>
      </g>
    );
  }
}
