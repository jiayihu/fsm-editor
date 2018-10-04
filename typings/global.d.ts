declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.html' {
  const content: string;
  export default content;
}

interface StyleRules extends React.CSSProperties {
  ':hover'?: React.CSSProperties;
  ':focus'?: React.CSSProperties;
  ':active'?: React.CSSProperties;

  '@media screen and (min-width: 63.25em)'?: React.CSSProperties;
  '@media screen and (min-width: 80rem)'?: React.CSSProperties;
}

type RadiumStyle<K extends string> = Record<K, StyleRules>;
