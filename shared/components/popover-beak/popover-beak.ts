import { css } from 'styled-components';

const BORDER = '1px solid var(--lido-app-ui-color-border-default)';

export const popoverBeak = css`
  && {
    /* Disables the panel's own scroll: tall content needs an inner scroll body */
    overflow: visible;
  }

  &&::before {
    content: '';
    position: absolute;
    left: var(--beak-x, 50%);
    margin-left: -6px;
    width: 12px;
    height: 12px;
    box-sizing: border-box;
    background: var(--lido-app-ui-color-background-surface);
    transform: rotate(45deg);
    pointer-events: none;
  }

  &&[data-placement='bottom']::before {
    top: -7px;
    border-top: ${BORDER};
    border-left: ${BORDER};
    border-top-left-radius: 2px;
  }

  &&[data-placement='top']::before {
    bottom: -7px;
    border-bottom: ${BORDER};
    border-right: ${BORDER};
    border-bottom-right-radius: 2px;
  }
`;
