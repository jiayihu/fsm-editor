const alpha = {
  hover: 0.04,
  focus: 0.12,
  selected: 0.08,
  activated: 0.12,
  pressed: 0.16,
  dragged: 0.08,
  disabled: 0.38
};
const colors = {
  primary: 'rgb(224, 224, 224)',
  primaryVariant: 'rgb(42, 42, 42)',
  secondary: 'rgb(96, 168, 242)',
  secondaryVariant: 'rgb(36, 136, 239)',
  surface: 'rgb(255, 255, 255)',
  error: 'rgb(176, 0, 32)'
};

export const theme = {
  alpha,
  breakpoints: [36, 48, 64],
  fontFamily: ['"Gotham", "Avenir Next", "Proxima Nova",  "Helvetica"'],
  fontSize: {
    h1: 96,
    h2: 60,
    h3: 48,
    h4: 34,
    h5: 24,
    h6: 20,
    body1: 16,
    body2: 14,
    caption: 12,
    button: 14
  },
  fontWeight: [400, 600, 700],
  lineHeight: {
    small: 1.5,
    medium: 1.5,
    heading: 1.2
  },

  /* Colors are defined as rgb to allow usage as rgba */
  colors: {
    ...colors,

    onPrimary: colors.primaryVariant,
    onPrimaryVariant: 'rgb(255, 255, 255)',
    onSecondary: 'rgb(255, 255, 255)',
    onSurface: 'rgb(0, 0, 0)',
    onSurfaceSecondary: 'rgba(0, 0, 0, 0.6)',
    onSurfaceDisabled: `rgba(0, 0, 0, ${alpha.disabled})`,
    onError: 'rgb(255, 255, 255)'
  },

  borderStyle: ['solid', 'double', 'dotted'],
  borderWidth: [0, 1, 2, 4],
  borderDirection: ['all', 'top', 'bottom'],
  radii: [0, 3, 5, 17, 9999],

  /**
   * Spacing taken from Tachyons, MD only recommends to use increments of 8dp
   * @src http://tachyons.io/docs/layout/spacing/
   */
  spacing: {
    none: 0,
    extraSmall: 4,
    small: 8,
    medium: 16,
    large: 32,
    extraLarge: 64,
    extraExtraLarge: 128,
    extraExtraExtraLarge: 256
  },

  animation: {
    duration: {
      simple: '0.1s',
      medium: '0.2s',
      complex: '0.5s',
      exit: 0.8 /* To be used as multiplier */
    },
    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      decelarate: 'cubic-bezier(0, 0, 0.2, 1)',
      accelerate: 'cubic-bezier(0.4, 0, 1, 1)'
    }
  },
  boxShadow: ['0 0 16px rgba(0,0,0,.2)'],
  measure: ['20em', '30em', '34em']
};
