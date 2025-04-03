import { Divider, ThemeToggler } from '@lidofinance/lido-ui';
import styled, { keyframes } from 'styled-components';

import { NAV_MOBILE_MEDIA } from 'styles/constants';

export const HeaderStyle = styled.header`
  grid-area: header;
  position: relative;
  align-self: center;

  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  row-gap: 8px;
  margin-block: 18px;
`;

export const HeaderActionsStyle = styled.div`
  position: relative;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-shrink: 1;
  gap: ${({ theme }) => theme.spaceMap.sm}px;

  flex-wrap: wrap;
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

export const ThemeTogglerStyle = styled(ThemeToggler)`
  margin: 0;
`;

export const LogosStyle = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  height: 28px;
  margin-block: 8px;
  align-self: start;
`;

export const LogoDivider = styled(Divider).attrs({ type: 'vertical' })`
  opacity: 0.6;
`;
