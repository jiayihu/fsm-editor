import React, {
  Component,
  ReactNode,
  KeyboardEvent,
  ChangeEvent,
  MouseEvent,
  CSSProperties
} from 'react';
import Radium from 'radium';
import { FState } from '../../domain/fstate';
import { ElementType } from '../types';
import { SVGBorder } from '../SVGBorder/SVGBorder';
import { TextRuler } from '../TextRuler/TextRuler';
import { theme } from '../../css/theme';
import { asCSS } from '../../utils/radium';

type Props = {
  fstate: FState;
  active: boolean;
  svgEl: SVGSVGElement | null;
  style?: CSSProperties;
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

export const SVGState = Radium(
  class SVGState extends Component<Props, State> {
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
      const {
        fstate: { text, style }
      } = this.props;

      switch (event.key) {
        case 'Escape': {
          this.setState({ type: 'READONLY' });
          this.props.onEditEnd(text, style.width, style.height);
          return;
        }
      }
    };

    handleDblClick = () => {
      if (!this.props.active) return;

      const {
        fstate: { text, style }
      } = this.props;

      this.props.onEditStart();
      this.setState({
        type: 'EDITING',
        text,
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
          return <span onDoubleClick={this.handleDblClick}>{this.props.fstate.text}</span>;
        case 'EDITING':
          return (
            <>
              <textarea
                autoFocus
                value={this.state.text}
                onChange={this.handleTextChange}
                onBlur={this.handleTextBlur}
                style={styles.input}
              />
              <TextRuler text={this.state.text} onCalculate={this.handleCalculateSize} />
            </>
          );
      }
    }

    render() {
      const {
        active,
        fstate: { coords, style: fstateStyle },
        style
      } = this.props;
      const isEditing = this.state.type === 'EDITING';
      const offset = isEditing ? 0 : this.padding;

      return (
        <g
          onKeyDown={this.handleKeyDown}
          onClick={this.props.onContentClick}
          style={asCSS([styles.fstate, style])}
        >
          <rect
            x={coords.x}
            y={coords.y}
            data-element={ElementType.state}
            width={fstateStyle.width}
            height={fstateStyle.height}
            rx={6}
            ry={6}
            style={asCSS([styles.rect, active && styles.isActiveRect])}
          />
          {active && (
            <SVGBorder
              coords={coords}
              width={fstateStyle.width}
              height={fstateStyle.height}
              onClick={this.props.onBorderClick}
            />
          )}

          <foreignObject
            x={coords.x + offset}
            y={coords.y + offset}
            width={
              this.state.type === 'EDITING'
                ? this.state.textWidth + this.padding * 2
                : this.getTextWidthInRect(fstateStyle.width)
            }
            height={
              this.state.type === 'EDITING'
                ? this.state.textHeight + this.padding * 2
                : this.getTextHeightInRect(fstateStyle.height)
            }
          >
            <div {...{ xmlns: 'http://www.w3.org/1999/xhtml' }} style={styles.text}>
              {this.renderText()}
            </div>
          </foreignObject>
        </g>
      );
    }
  }
);

const styles: RadiumStyle<'fstate' | 'rect' | 'text' | 'input' | 'isActiveRect'> = {
  fstate: {
    fill: 'none',
    stroke: 'rgb(var(--primary-variant))',
    strokeWidth: '2px'
  },
  rect: {
    fill: 'rgb(var(--surface))'
  },
  text: {
    height: '100%',
    lineHeight: '1',
    whiteSpace: 'pre-wrap'
  },
  input: {
    appearance: 'none',
    backgroundColor: '#fff',
    border: 'none',
    boxShadow: 'none',
    color: 'inherit',
    height: '100%',
    lineHeight: '1',
    padding: '1rem',
    position: 'relative',
    verticalAlign: 'top',
    width: '100%'
  },

  isActiveRect: {
    cursor: 'move'
  }
};
