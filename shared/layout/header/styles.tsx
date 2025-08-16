import {
  Button,
  ButtonProps,
  Divider,
  ThemeToggler,
} from '@lidofinance/lido-ui';
import styled, { keyframes } from 'styled-components';

import { NAV_MOBILE_MEDIA } from 'styles/constants';

export const HeaderWrapper = styled.div`
  grid-area: header;

  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;

  position: sticky;
  z-index: 250;
  top: 0;
  left: 0;
  right: 0;

  padding: 0 32px;
  margin: 0 -32px;
`;

export const HeaderStyle = styled.header`
  align-self: center;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  width: 100%;
  padding: 18px 0;

  transition:
    box-shadow 0.3s ease,
    background 0.3s ease-out;

  html:is([data-scrolldown='true']) & {
    background: var(--lido-color-background);
    box-shadow: 0px 3px 3px -3px var(--lido-color-shadowDark);
  }

  ${NAV_MOBILE_MEDIA} {
    nav[aria-expanded='true'] + & {
      background: none !important;
      box-shadow: none !important;
    }
  }
`;

export const HeaderActionsStyle = styled.div`
  position: relative;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-shrink: 1;
  gap: ${({ theme }) => theme.spaceMap.sm}px;

  flex-wrap: nowrap;
  justify-content: end;
`;

export const HeaderWalletChainWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const HeaderWalletChainStyle = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
  line-height: 1.2em;
`;

const glimmer = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  60% { opacity: 1; }
  100% { opacity: 0; }
`;

export const DotStyle = styled.p`
  height: 6px;
  width: 6px;
  background-color: lightgreen;
  border-radius: 50%;
  animation: ${glimmer} 2s ease-in-out infinite;
  margin-right: ${({ theme }) => theme.spaceMap.sm}px;
  margin-left: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const IPFSInfoBoxOnlyDesktopWrapper = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 15px);
  width: 255px;
  z-index: 3;

  ${NAV_MOBILE_MEDIA} {
    display: none;
  }
`;

export const ThemeTogglerStyle = styled(ThemeToggler)<{ $always?: boolean }>`
  margin: 0;

  ${NAV_MOBILE_MEDIA} {
    display: ${({ $always }) => ($always ? 'inline-grid' : 'none')};
  }
`;

export const LogosStyle = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  height: 28px;
  margin-block: 8px;
  align-self: start;

  ${({ theme }) => theme.mediaQueries.md} {
    > :not(:nth-child(1)) {
      display: none;
    }
  }
`;

export const LogoDivider = styled(Divider).attrs({ type: 'vertical' })`
  opacity: 0.6;
`;

export const HeaderButton = styled((props: ButtonProps) => (
  <Button size="sm" variant="text" color="secondary" {...props} />
))`
  --grouped-padding-offset: 2px;
  --padding: 8px;
  flex-shrink: 1;
  min-width: unset;
  overflow: hidden;
  height: 44px; // header height
  padding: 0 var(--padding);

  > span:first-of-type {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0;

  > * {
    :not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding-left: calc(
        var(--padding, 0px) - var(--grouped-padding-offset, 0px)
      );
    }
    :not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      padding-right: calc(
        var(--padding, 0px) - var(--grouped-padding-offset, 0px)
      );
    }
  }
`;
