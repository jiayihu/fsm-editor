import './SVGState.css';
import React, {
  Component,
  ReactNode,
  KeyboardEvent,
  ChangeEvent,
  MouseEvent,
  SyntheticEvent
} from 'react';
import classnames from 'classnames';
import TextareaAutosize from 'react-autosize-textarea';
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
    }
  };

  handleDblClick = () => {
    if (!this.props.active) return;

    this.setState({ type: 'EDITING', text: this.props.text });
  };

  handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
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
          <TextareaAutosize
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
    const padding = isEditing ? 0 : 16;

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
          x={coords.x + padding}
          y={coords.y + padding}
          width={style.width - padding * 2}
          height={style.height - padding * 2}
          xmlns="http://www.w3.org/1999/xhtml"
        >
          <div className="fstate__text">{this.renderText()}</div>
        </foreignObject>
      </g>
    );
  }
}
