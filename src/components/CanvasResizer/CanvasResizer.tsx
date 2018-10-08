import React, { Component, ReactNode, RefObject, createRef } from 'react';
import Radium from 'radium';
import { Point } from '../../domain/geometry';
import { SVGIcon } from '../SVGIcon/SVGIcon';
import { theme } from '../../css/theme';
import { asCSS } from '../../utils/radium';

type Props = {
  type: 'READONLY' | 'DRAGGING';
  position: Point | null;
  render: (width: number, height: number) => ReactNode;
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
};

export const CanvasResizer = Radium(
  class CanvasResizer extends Component<Props, State> {
    scrollRef: RefObject<HTMLDivElement>;

    constructor(props: Props) {
      super(props);
      this.state = {
        type: 'READONLY',
        height: 200,
        width: 200
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
      this.setState({ type: 'DRAGGING', axis, height: this.state.height, width: this.state.width });

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

    render() {
      return (
        <div ref={this.scrollRef} style={styles.canvasScroll}>
          {this.props.render(this.state.width, this.state.height)}
          <SVGIcon
            name="resize"
            onMouseDown={() => this.handleDragStart('y')}
            style={asCSS([styles.verticalHandle, { top: this.state.height }])}
          />
        </div>
      );
    }
  }
);

const styles: RadiumStyle<'canvasScroll' | 'horizontalHandle' | 'verticalHandle'> = {
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
  }
};
