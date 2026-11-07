/// <reference types="vitest/globals" />
/// <reference types="next" />
/// <reference types="next/image-types/global" />
interface Window {
  // see _document.js for definition
  _paq: undefined | [string, ...unknown[]][];

  ethereum?: any;
}

declare module '*.svg' {
  /**
   * Use `any` to avoid conflicts with
   * `@svgr/webpack` plugin or
   * `babel-plugin-inline-react-svg` plugin.
   */
  const content: any;
  export const ReactComponent: React.FunctionComponent<
    React.ComponentProps<'svg'>
  >;
  export default content;
}
