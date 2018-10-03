import './SVGState.css';
import React, { Component, ReactNode, KeyboardEvent, ChangeEvent, MouseEvent } from 'react';
import classnames from 'classnames';
import { FState } from '../../domain/fstate';
import { ElementType } from '../types';
import { SVGBorder } from '../SVGBorder/SVGBorder';
import { TextRuler } from '../TextRuler/TextRuler';
import { theme } from '../../css/theme';

type Props = FState & {
  active: boolean;
  svgEl: SVGSVGElement | null;
  onBorderClick: (event: MouseEvent<SVGRectElement>) => void;
  onContentClick: (event: MouseEvent<SVGRectElement>) => void;
  onEditStart: () => void;
  onEditEnd: (text: string, width: number, height: number) => void;
};

type State =
  | { type: 'READONLY' }
  | {
      type: 'EDITING';
      text: string;
      textWidth: number;
      textHeight: number;
    };

export class SVGState extends Component<Props, State> {
  padding = theme.fontSize;

  constructor(props: Props) {
    super(props);
    this.state = { type: 'READONLY' };
  }

  getTextWidthInRect(rectWidth: number): number {
    return rectWidth - this.padding * 2;
  }

  getTextHeightInRect(rectHeight: number): number {
    return rectHeight - this.padding * 2;
  }

  handleCalculateSize = (width: number, height: number) => {
    this.setState({ type: 'EDITING', textWidth: width, textHeight: height });
  };

  handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape': {
        const { style } = this.props;
        this.setState({ type: 'READONLY' });
        this.props.onEditEnd(this.props.text, style.width, style.height);
        return;
      }
    }
  };

  handleDblClick = () => {
    if (!this.props.active) return;

    const { style } = this.props;

    this.props.onEditStart();
    this.setState({
      type: 'EDITING',
      text: this.props.text,
      textWidth: this.getTextWidthInRect(style.width),
      textHeight: this.getTextHeightInRect(style.height)
    });
  };

  handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ type: 'EDITING', text: event.target.value });
  };

  handleTextBlur = () => {
    if (this.state.type !== 'EDITING') return;

    const width = this.state.textWidth + this.padding * 2;
    const height = this.state.textHeight + this.padding * 2;

    this.setState({ type: 'READONLY' });
    this.props.onEditEnd(this.state.text, width, height);
  };

  renderText(): ReactNode {
    switch (this.state.type) {
      case 'READONLY':
        return <span onDoubleClick={this.handleDblClick}>{this.props.text}</span>;
      case 'EDITING':
        return (
          <textarea
            autoFocus
            className="fstate__input"
            value={this.state.text}
            onChange={this.handleTextChange}
            onBlur={this.handleTextBlur}
          />
        );
    }
  }

  render() {
    const { active, coords, style } = this.props;
    const isEditing = this.state.type === 'EDITING';
    const className = classnames('fstate', {
      'is-active': active,
      'is-editing': isEditing
    });
    const offset = isEditing ? 0 : this.padding;

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
          x={coords.x + offset}
          y={coords.y + offset}
          width={
            this.state.type === 'EDITING'
              ? this.state.textWidth + this.padding * 2
              : this.getTextWidthInRect(style.width)
          }
          height={
            this.state.type === 'EDITING'
              ? this.state.textHeight + this.padding * 2
              : this.getTextHeightInRect(style.height)
          }
        >
          <div {...{ xmlns: 'http://www.w3.org/1999/xhtml' }} className="fstate__text">
            {this.renderText()}
            {this.state.type === 'EDITING' ? (
              <TextRuler text={this.state.text} onCalculate={this.handleCalculateSize} />
            ) : null}
          </div>
        </foreignObject>
      </g>
    );
  }
}
