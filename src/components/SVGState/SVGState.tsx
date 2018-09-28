import './SVGState.css';
import React, {
  Component,
  createElement,
  ReactNode,
  KeyboardEvent,
  ChangeEvent,
  MouseEvent
} from 'react';
import { FState } from '../../domain/fstate';
import { ElementType } from '../types';
import { SVGBorder } from '../SVGBorder/SVGBorder';
import Icon from '../Icon/Icon';

type Props = FState & {
  svgEl: SVGSVGElement | null;
  onBorderClick: (event: MouseEvent<SVGRectElement>) => void;
  onTextChange: (text: string) => void;
  onDelete: (fstate: FState) => void;
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
    this.setState({ type: 'EDITING', text: this.props.text });
  };

  handleDelete = () => {
    this.props.onDelete(this.props);
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
    const { coords, text, style } = this.props;
    // Use `createElement` because TS doesn't allow `xmlsn` on div
    const textEl = createElement(
      'div',
      { className: 'fstate__text', xmlns: 'http://www.w3.org/1999/xhtml' },
      this.renderText()
    );

    return (
      <g className="fstate" onKeyDown={this.handleKeyDown}>
        <rect
          x={coords.x}
          y={coords.y}
          data-element={ElementType.state}
          width={style.width}
          height={style.height}
          className="fstate__rect"
        />
        <SVGBorder
          coords={coords}
          width={style.width}
          height={style.height}
          onClick={this.props.onBorderClick}
        />
        <circle
          cx={coords.x + style.width}
          cy={coords.y}
          r="8"
          className="fstate__delete"
          onClick={this.handleDelete}
        />
        <Icon
          name="delete"
          width="12"
          height="12"
          x={coords.x + style.width - 6}
          y={coords.y - 5}
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
