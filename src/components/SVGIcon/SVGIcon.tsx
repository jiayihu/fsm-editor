import React, { Component, SVGProps } from 'react';
import Radium from 'radium';
import { theme } from '../../css/theme';
import { asCSS } from '../../utils/radium';

type Props = SVGProps<SVGSVGElement> & {
  name: 'delete' | 'resize';
};

export const SVGIcon = Radium(
  class SVGIcon extends Component<Props> {
    icons = {
      delete: () => {
        return (
          <g transform="matrix( 1, 0, 0, 1, 0,0) ">
            <path
              fill="currentColor"
              stroke="2"
              d=" M 91.1 11.1 Q 91.5966796875 10.659375 91.6 10 91.596875 9.3404296875 91.1 8.85 90.6595703125 8.403125 90 8.4 89.3404296875 8.403125 88.85 8.85 L 50 47.75 11.1 8.85 Q 10.659375 8.403125 10 8.4 9.3404296875 8.403125 8.85 8.85 8.403125 9.3404296875 8.4 10 8.403125 10.659375 8.85 11.1 L 47.75 50 8.85 88.85 Q 8.403125 89.3404296875 8.4 90 8.403125 90.6595703125 8.85 91.1 9.3404296875 91.596875 10 91.6 10.659375 91.5966796875 11.1 91.1 L 50 52.25 88.85 91.1 Q 89.3404296875 91.5966796875 90 91.6 90.6595703125 91.596875 91.1 91.1 91.596875 90.6595703125 91.6 90 91.5966796875 89.3404296875 91.1 88.85 L 52.25 50 91.1 11.1 Z"
            />
          </g>
        );
      },
      resize: () => {
        return (
          <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
            <path
              fill="currentColor"
              fillRule="nonzero"
              d="M430.647224,239.946317 L399.43528,208.879208 C399.421312,208.865305 399.407386,208.851361 399.393501,208.837376 C395.50229,204.918152 395.524999,198.586543 399.444223,194.695331 L408.206884,185.995302 C412.106244,182.123813 418.398847,182.123813 422.298207,185.995302 L485.659399,248.903617 C485.676367,248.920463 485.693274,248.937371 485.71012,248.954339 C489.601332,252.873563 489.578623,259.205172 485.659399,263.096383 L422.298207,326.004698 C418.398847,329.876187 412.106244,329.876187 408.206884,326.004698 L399.444223,317.304669 C399.430238,317.290784 399.416294,317.276857 399.402391,317.26289 C395.506241,313.348575 395.520965,307.016943 399.43528,303.120792 L430.647224,272.053683 L371.806869,272.053683 C366.284021,272.053683 361.806869,267.57653 361.806869,262.053683 L361.806869,249.946317 C361.806869,244.42347 366.284021,239.946317 371.806869,239.946317 L430.647224,239.946317 Z M80.966514,272.053683 L112.178458,303.120792 C112.192425,303.134695 112.206352,303.148639 112.220237,303.162624 C116.111448,307.081848 116.088739,313.413457 112.169515,317.304669 L103.406854,326.004698 C99.5074941,329.876187 93.214891,329.876187 89.3155311,326.004698 L25.954339,263.096383 C25.9373711,263.079537 25.9204637,263.062629 25.9036172,263.045661 C22.0124058,259.126437 22.0351147,252.794828 25.954339,248.903617 L89.3155311,185.995302 C93.214891,182.123813 99.5074941,182.123813 103.406854,185.995302 L112.169515,194.695331 C112.1835,194.709216 112.197444,194.723143 112.211346,194.73711 C116.107497,198.651425 116.092772,204.983057 112.178458,208.879208 L80.966514,239.946317 L139.806869,239.946317 C145.329716,239.946317 149.806869,244.42347 149.806869,249.946317 L149.806869,262.053683 C149.806869,267.57653 145.329716,272.053683 139.806869,272.053683 L80.966514,272.053683 Z M215.806869,19 C229.061703,19 239.806869,29.745166 239.806869,43 L239.806869,469 C239.806869,482.254834 229.061703,493 215.806869,493 C202.552035,493 191.806869,482.254834 191.806869,469 L191.806869,43 C191.806869,29.745166 202.552035,19 215.806869,19 Z M302.806869,19 C316.061703,19 326.806869,29.745166 326.806869,43 L326.806869,469 C326.806869,482.254834 316.061703,493 302.806869,493 C289.552035,493 278.806869,482.254834 278.806869,469 L278.806869,43 C278.806869,29.745166 289.552035,19 302.806869,19 Z"
            />
          </g>
        );
      }
    };
    render() {
      const { name, ...otherProps } = this.props;
      const { style, ...svgProps } = otherProps;

      return (
        <svg viewBox="0 0 512 640" {...svgProps} style={asCSS([styles.svg, style])}>
          {this.icons[name]()}
        </svg>
      );
    }
  }
);

const styles: RadiumStyle<'svg'> = {
  svg: {
    color: theme.colors.primaryVariant,
    width: 32,
    height: 32
  }
};
