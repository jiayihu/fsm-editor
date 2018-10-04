import React from 'react';
import { render } from 'react-dom';
import Radium from 'radium';
import { App } from './layout/App/App';
import { globalStyle } from './css/GlobalStyle';

render(
  <Radium.StyleRoot>
    {globalStyle}
    <App />
  </Radium.StyleRoot>,
  document.getElementById('root')
);
