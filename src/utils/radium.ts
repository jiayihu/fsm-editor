import { CSSProperties } from 'react';

type RadiumStyleProp = CSSProperties | undefined | null | boolean;

/**
 * Allows to use Radium styles as React style prop without TS complaining
 */
export function asCSS(styles: RadiumStyleProp | RadiumStyleProp[]): CSSProperties {
  return styles as any;
}
