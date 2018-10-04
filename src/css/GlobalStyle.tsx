import React, { CSSProperties } from 'react';
import Radium from 'radium';
import { theme } from './theme';

export const globalStyle = (
  <Radium.Style
    rules={{
      '*': {
        boxSizing: 'border-box'
      },

      html: {
        lineHeight: theme.lineHeight.medium
      },

      body: {
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
      },

      a: {
        color: theme.colors.primary
      },

      'h1, h2, h3, h4, h5, h6': {
        fontWeight: 'normal',
        lineHeight: theme.lineHeight.heading,
        margin: 0
      },

      button: {
        alignItems: 'center',
        appearance: 'none',
        border: '1px solid #0000',
        borderRadius: '4px',
        boxShadow: 'none',
        display: 'inline-flex',
        fontSize: '1rem',
        height: '2.25em',
        justifyContent: 'flex-start',
        lineHeight: '1.5',
        paddingBottom: 'calc(0.375em - 1px)',
        paddingLeft: 'calc(0.625em - 1px)',
        paddingRight: 'calc(0.625em - 1px)',
        paddingTop: 'calc(0.375em - 1px)',
        position: 'relative',
        verticalAlign: 'top'
      }
    }}
  />
);
