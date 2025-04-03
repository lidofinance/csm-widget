import { createGlobalStyle } from 'styled-components';

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
  html,
  body {
    width: 100%;
    min-height: 100%;
    display: grid;
    grid-template-rows: 1fr;
  }
  body {
    background: var(--lido-color-background);
    color: var(--lido-color-text);
    position: relative;
    box-sizing: border-box;
    font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
    line-height: 1.5em;
    font-weight: 500;
    text-size-adjust: none;
  }
  a {
    cursor: pointer;
    text-decoration: none;
    color: var(--lido-color-primary);

    &:visited {
      color: var(--lido-color-primaryVisited);
    }

    &:hover {
      color: var(--lido-color-primaryHover);
    }
  }

  ul {
    padding-inline-start: 1.8em;
  }

  ol {
    padding-inline-start: 18px;
  }

  #lido-ui-modal-root [role='listbox'] {
    max-height: 334px;
    overflow-y: scroll;
  }
`;

export default GlobalStyle;
