import React, { Component } from 'react';
import { ElementType } from '../types';

type Props = {};

export default class extends Component<Props> {
  static getDefs() {
    return (
      <>
        <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#smallGrid)" />
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1" />
        </pattern>
      </>
    );
  }

  render() {
    return (
      <rect
        data-element={ElementType.grid}
        className="grid js-not-exported"
        width="100%"
        height="100%"
        fill="url(#grid)"
      />
    );
  }
}
