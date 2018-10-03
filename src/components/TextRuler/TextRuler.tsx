import './TextRuler.css';
import React, { PureComponent, RefObject, createRef } from 'react';

type Props = {
  text: string;
  onCalculate: (width: number, height: number) => void;
};

export class TextRuler extends PureComponent<Props> {
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
      <pre ref={this.rulerRef} className="ruler">
        {this.props.text}
      </pre>
    );
  }
}
