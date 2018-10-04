import React, { Component, SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & {
  name: 'delete';
};

export default class Icon extends Component<Props> {
  icons = {
    delete: this.renderDelete
  };

  renderDelete(svgProps: SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 100 125" {...svgProps}>
        <g transform="matrix( 1, 0, 0, 1, 0,0) ">
          <path
            fill="#000000"
            stroke="2"
            d=" M 91.1 11.1 Q 91.5966796875 10.659375 91.6 10 91.596875 9.3404296875 91.1 8.85 90.6595703125 8.403125 90 8.4 89.3404296875 8.403125 88.85 8.85 L 50 47.75 11.1 8.85 Q 10.659375 8.403125 10 8.4 9.3404296875 8.403125 8.85 8.85 8.403125 9.3404296875 8.4 10 8.403125 10.659375 8.85 11.1 L 47.75 50 8.85 88.85 Q 8.403125 89.3404296875 8.4 90 8.403125 90.6595703125 8.85 91.1 9.3404296875 91.596875 10 91.6 10.659375 91.5966796875 11.1 91.1 L 50 52.25 88.85 91.1 Q 89.3404296875 91.5966796875 90 91.6 90.6595703125 91.596875 91.1 91.1 91.596875 90.6595703125 91.6 90 91.5966796875 89.3404296875 91.1 88.85 L 52.25 50 91.1 11.1 Z"
          />
        </g>
      </svg>
    );
  }

  render() {
    const { name, ...svgProps } = this.props;

    return this.icons[name](svgProps);
  }
}
