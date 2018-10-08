import React, { Component, ReactNode, RefObject, createRef } from 'react';
import Radium from 'radium';
import { Point } from '../../domain/geometry';
import { SVGIcon } from '../SVGIcon/SVGIcon';
import { theme } from '../../css/theme';
import { asCSS } from '../../utils/radium';

type Props = {
  type: 'READONLY' | 'DRAGGING';
  position: Point | null;
  render: (width: number, height: number, viewBox: string) => ReactNode;
};

type States =
  | {
      type: 'READONLY';
    }
  | {
      type: 'DRAGGING';
      axis: 'x' | 'y';
    };

type State = States & {
  height: number;
  width: number;
  zoom: number;
};

export const CanvasResizer = Radium(
  class CanvasResizer extends Component<Props, State> {
    scrollRef: RefObject<HTMLDivElement>;

    constructor(props: Props) {
      super(props);
      this.state = {
        type: 'READONLY',
        height: 200,
        width: 200,
        zoom: 1
      };

      this.scrollRef = createRef();
    }

    componentDidMount() {
      if (!this.scrollRef.current) return;

      const rect = this.scrollRef.current.getBoundingClientRect();

      this.setState({ height: rect.height, width: rect.width });
    }

    componentDidUpdate(_: Props, prevState: State) {
      if (prevState.height !== this.state.height && this.scrollRef.current) {
        this.scrollRef.current.scrollTop = this.state.height;
      }
    }

    handleDragStart = (axis: 'x' | 'y') => {
      this.setState({
        type: 'DRAGGING',
        axis,
        height: this.state.height,
        width: this.state.width,
        zoom: 1
      });

      window.addEventListener('mousemove', this.handleDragMove);
      window.addEventListener('mouseup', this.handleDragEnd);
    };

    handleDragMove = (event: MouseEvent) => {
      if (!this.scrollRef.current || this.state.type !== 'DRAGGING') return;

      const isVertical = this.state.axis === 'y';
      const rect = this.scrollRef.current.getBoundingClientRect();
      const { clientX, clientY } = event;
      const distanceFromOrigin = isVertical ? clientY - rect.top : clientX - rect.left;
      const distanceFromEnd = isVertical ? clientY - rect.bottom : clientX - rect.right;

      if (distanceFromOrigin <= 0) return;

      if (distanceFromEnd > 0) {
        // Increasing size
        isVertical
          ? this.setState({ type: 'READONLY', height: rect.height + 150 })
          : this.setState({ type: 'READONLY', width: rect.width + 300 });
      } else {
        // Reducing size
        isVertical
          ? this.setState({ height: distanceFromOrigin })
          : this.setState({ width: distanceFromOrigin });
      }
    };

    handleDragEnd = () => {
      this.setState({ type: 'READONLY' });

      window.removeEventListener('mousemove', this.handleDragMove);
    };

    handleZoomIn = () => {
      console.log('zooming in', this.state.zoom);
      this.setState({ zoom: this.state.zoom + 0.25 });
    };

    handleZoomOut = () => {
      console.log('zooming out', this.state.zoom);
      this.setState({ zoom: this.state.zoom - 0.25 });
    };

    render() {
      const { width, height, zoom } = this.state;
      const viewBox = `0 0 ${width / zoom} ${height / zoom}`;

      return (
        <div ref={this.scrollRef} style={styles.canvasScroll}>
          {this.props.render(width, height, viewBox)}
          <SVGIcon
            name="resize"
            onMouseDown={() => this.handleDragStart('y')}
            style={asCSS([styles.verticalHandle, { top: height }])}
          />
          <SVGIcon
            name="zoomIn"
            onClick={this.handleZoomIn}
            style={asCSS([styles.zoom, styles.zoomIn])}
          />
          <SVGIcon
            name="zoomOut"
            onClick={this.handleZoomOut}
            style={asCSS([styles.zoom, styles.zoomOut])}
          />
        </div>
      );
    }
  }
);

const styles: RadiumStyle<
  'canvasScroll' | 'horizontalHandle' | 'verticalHandle' | 'zoom' | 'zoomIn' | 'zoomOut'
> = {
  canvasScroll: {
    display: 'flex',
    flex: '1 0 auto',
    flexDirection: 'column',
    position: 'relative'
  },
  horizontalHandle: {
    color: theme.colors.primaryVariant,
    cursor: 'pointer',
    position: 'absolute',
    top: '50%',
    transform: `translate(-100%, -50%)`
  },
  verticalHandle: {
    color: theme.colors.primaryVariant,
    cursor: 'pointer',
    position: 'absolute',
    right: '50%',
    transform: `translate(-50%, -100%) rotate(90deg)`
  },
  zoom: {
    cursor: 'pointer',
    height: theme.spacing.extraLarge,
    position: 'absolute',
    right: 0,
    width: theme.spacing.extraLarge
  },
  zoomIn: {
    top: 0
  },
  zoomOut: {
    top: theme.spacing.extraLarge
  }
};
