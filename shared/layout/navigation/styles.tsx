import { Sidebar } from '@lidofinance/lido-app-ui';
import styled, { keyframes } from 'styled-components';

import { SIDEBAR_DESKTOP_MEDIA } from 'styles/constants';
import { ButtonGroup } from '../header/styles';

export const SidebarOperatorGroup = styled(ButtonGroup)`
  width: 100%;
  padding-bottom: 16px;

  > * {
    min-width: 0;
  }

  > :first-child:not(:last-child) {
    flex: 0 1 auto;
  }

  > :last-child {
    flex: 1 1 0;
  }
`;

const growToFullHeight = keyframes`
  to {
    height: 100dvh;
  }
`;

// The sticky sidebar shrinks by the still-visible part of the scrolling banner; `&&` beats the lib's CSS-module class
export const SidebarStyle = styled(Sidebar)`
  ${SIDEBAR_DESKTOP_MEDIA} {
    && {
      height: calc(100dvh - var(--test-env-banner-height, 0px));

      @supports (animation-timeline: scroll()) {
        animation: ${growToFullHeight} linear both;
        animation-timeline: scroll(root);
        animation-range: 0 var(--test-env-banner-height, 0px);
      }
    }
  }
`;
