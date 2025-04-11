import { CounterStyle } from 'shared/components/counter/styles';
import styled, { css, keyframes } from 'styled-components';

import { NAV_MOBILE_MEDIA } from 'styles/constants';

export const NavItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 20px;
`;

export const NavTitle = styled.div`
  display: none;
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 2em;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.5;

  ${NAV_MOBILE_MEDIA} {
    display: flex;
  }
`;

export const NavBlockStyle = styled.div<{ $onlyMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  &:has(${NavItems}:empty) {
    display: none;
  }

  ${({ $onlyMobile }) =>
    $onlyMobile
      ? css`
          display: none;

          ${NAV_MOBILE_MEDIA} {
            display: flex;
          }
        `
      : ''}
`;

export const desktopCss = css`
  grid-area: nav;
  position: sticky;
  top: 3rem;
  align-self: start;

  flex-direction: column;
  align-items: start;

  margin-top: 4rem;
  display: flex;
  gap: 40px;

  svg {
    flex-shrink: 0;
  }

  &[hidden] {
    display: none;
  }
`;

const menuAppearing = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const mobileCss = css`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 100vh;
  padding: 145px 45px 40px;
  margin: 0;

  background: rgba(var(--lido-rgb-background), 0.5);
  backdrop-filter: blur(12px);
  z-index: 98;
  animation: ${menuAppearing} ${({ theme }) => theme.duration.norm} ease 0s 1;

  &[hidden] {
    display: flex;
  }

  &[aria-expanded='false'] {
    display: none;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 145px 20px 40px;
  }
`;

export const Nav = styled.nav`
  ${desktopCss}

  // mobile kicks in on a bit higher width for nav
  ${NAV_MOBILE_MEDIA} {
    ${mobileCss}
  }

  z-index: 6;
`;

// Not wrapping <a> inside <a> in IPFS mode
// Also avoid problems with migrate to Next v13
// see: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#link-component
export const NavLink = styled.span<{ $active?: boolean }>`
  cursor: pointer;
  color: var(--lido-color-secondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxxs}px;
  line-height: 1.7em;
  font-weight: 800;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  text-decoration: none !important;
  letter-spacing: 0.04em;
  opacity: ${(props) => (props.$active ? 1 : 0.7)};

  gap: 10px;
  ${NAV_MOBILE_MEDIA} {
    gap: 7px;
  }

  :hover {
    opacity: 1;
    color: var(--lido-color-secondary);
  }

  // TODO: Not actual - remove
  :visited {
    color: var(--lido-color-secondary);
  }

  svg {
    fill: ${({ $active }) =>
      $active ? `var(--lido-color-primary)` : `var(--lido-color-secondary)`};
  }

  ${CounterStyle} {
    opacity: ${(props) => (props.$active ? 1 : 0.8)};
  }
`;
