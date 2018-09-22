import './App.css';
import React, { Component } from 'react';
import Canvas from '../../components/Canvas/Canvas';

type Props = {};

export default class extends Component<Props> {
  render() {
    return (
      <div className="app">
        <header className="app__header">
          <div className="container">
            <h1>Finite State Machine Editor</h1>
          </div>
        </header>

        <main>
          <Canvas />
        </main>

        <footer className="app__footer">
          <div className="container">
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
