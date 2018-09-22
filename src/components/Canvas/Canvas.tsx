import React, { Component } from 'react';

type Props = {};

export default class Canvas extends Component<Props> {
  render() {
    return (
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />
        <text x="10" y="10">
          Hello world
        </text>
      </svg>
    );
  }
}
