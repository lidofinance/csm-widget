import { createGlobalStyle } from 'styled-components';
import { NAV_MOBILE_MEDIA } from './constants';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  svg {
    box-sizing: content-box;
  }
  body {
    background: var(--lido-app-ui-color-background-page);
    color: var(--lido-app-ui-color-text-default);
    font-family: var(--lido-app-ui-font-family);
    position: relative;
    box-sizing: border-box;
    font-size: var(--lido-app-ui-font-size-label);
    line-height: 1.5em;
    font-weight: 500;
    text-size-adjust: none;

    width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
    padding-right: 0 !important;
  }
  /* lib (CSS-module) anchors own their colors */
  a:not([class*='-module_']) {
    cursor: pointer;
    text-decoration: none;
    color: var(--lido-app-ui-color-text-active);

    &:visited {
      color: var(--lido-app-ui-color-text-active-hover);
    }

    &:hover {
      color: var(--lido-app-ui-color-text-active-hover);
    }
  }

  ul {
    padding-inline-start: 1.8em;
  }

  ol {
    padding-inline-start: 18px;
  }

  ${NAV_MOBILE_MEDIA} {
    body {
     overflow-x: inherit;
    }
  }
`;

export default GlobalStyle;
