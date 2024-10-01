import { Container, ContainerProps, ThemeToggler } from '@lidofinance/lido-ui';
import styled, { keyframes } from 'styled-components';

import { NAV_MOBILE_MEDIA } from 'styles/constants';

export const HeaderContentStyle = styled.div`
  display: flex;
  align-items: center;

  flex-wrap: wrap;
  row-gap: 8px;

  @media screen and (max-width: 880px) {
    flex-wrap: nowrap;
  }
`;

export const HeaderStyle = styled((props: ContainerProps) => (
  <Container {...props} />
))`
  position: relative;
  padding-top: 18px;
  padding-bottom: 18px;
`;

export const HeaderActionsStyle = styled.div`
  position: relative;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-shrink: 1;
  gap: ${({ theme }) => theme.spaceMap.sm}px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-wrap: wrap;
    justify-content: end;
  }
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
