import React, { PureComponent, RefObject, createRef, CSSProperties } from 'react';
import Radium from 'radium';
import { asCSS } from '../../utils/radium';

type Props = {
  text: string;
  onCalculate: (width: number, height: number) => void;
  style?: CSSProperties;
};

export const TextRuler = Radium(
  class TextRuler extends PureComponent<Props> {
    rulerRef: RefObject<HTMLPreElement>;

    constructor(props: Props) {
      super(props);

      this.rulerRef = createRef();
    }

    componentDidUpdate() {
      if (!this.rulerRef.current) return;

      const width = this.rulerRef.current.offsetWidth + 6; // +4 is just because textarea text is some px longer than ruler width
      const height = this.rulerRef.current.offsetHeight;

      this.props.onCalculate(width, height);
    }

    render() {
      return (
        <pre ref={this.rulerRef} style={asCSS([styles.ruler, this.props.style])}>
          {this.props.text}
        </pre>
      );
    }
  }
);

const styles: RadiumStyle<'ruler'> = {
  ruler: {
    display: 'inline-block',
    fontFamily: 'inherit',
    lineHeight: 'inherit',
    visibility: 'hidden'
  }
};
