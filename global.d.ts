/// <reference types="vitest/globals" />
/// <reference types="next" />
/// <reference types="next/image-types/global" />
interface Window {
  // see _document.js for definition
  _paq: undefined | [string, ...unknown[]][];

  ethereum?: any;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.svg?react' {
  const Component: React.FC<React.ComponentProps<'svg'>>;
  export default Component;
}
