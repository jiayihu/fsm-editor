import React, { Component } from 'react';
import { Canvas } from '../../components/Canvas/Canvas';
import Radium from 'radium';
import { theme } from '../../css/theme';

type Props = {};

export const App = Radium(
  class App extends Component<Props> {
    render() {
      return (
        <div style={styles.app}>
          <header style={styles.header}>
            <div style={styles.container}>
              <h1 style={styles.title}>Finite State Machine Editor</h1>
            </div>
          </header>

          <main style={styles.main}>
            <Canvas />
          </main>

          <footer style={styles.footer}>
            <div style={styles.container}>
              <p>
                Built by{' '}
                <a href="https://github.com/jiayihu" rel="noopener">
                  jiayihu
                </a>.
              </p>
            </div>
          </footer>
        </div>
      );
    }
  }
);

const styles: RadiumStyle<'app' | 'header' | 'main' | 'title' | 'container' | 'footer'> = {
  app: {
    display: 'grid',
    gridTemplateColumns: 'auto',
    gridTemplateRows: 'auto 1fr auto',
    height: '100vh'
  },
  header: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.onPrimary,
    padding: `${theme.spacing.large} 0`,
    textAlign: 'center'
  },
  main: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    margin: `${theme.spacing.medium}px 0`
  },
  container: {
    margin: '0 auto',
    position: 'relative',

    '@media screen and (min-width: 63.25em)': {
      maxWidth: '1012px',
      width: '1012px'
    },
    '@media screen and (min-width: 80rem)': {
      maxWidth: '1152px',
      width: '1152px'
    }
  },
  footer: {
    backgroundColor: theme.colors.primaryVariant,
    color: theme.colors.onPrimaryVariant
  }
};
