import { CounterStyle } from 'shared/components/counter/styles';
import styled, { css } from 'styled-components';

import { NAV_MOBILE_MEDIA } from 'styles/constants';

export const desktopCss = css`
  grid-area: nav;
  position: sticky;
  top: 3rem;
  align-self: start;

  flex-direction: column;
  align-items: start;

  margin-top: 4rem;
  display: flex;
  gap: 32px;

  svg {
    flex-shrink: 0;
  }
`;

const mobileCss = css`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  grid-gap: 16px;

  margin: 0;
  position: fixed;
  top: auto;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;

  background-color: var(--lido-color-foreground);
  border-top: 1px solid var(--lido-color-border);
  min-height: 60px;
`;

export const Nav = styled.nav`
  ${desktopCss}
  // mobile kicks in on a bit higher width for nav
  ${NAV_MOBILE_MEDIA} {
    ${mobileCss}
  }
  &:empty {
    display: none;
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

  ${NAV_MOBILE_MEDIA} {
    flex-direction: column;
    text-transform: none;
    text-align: center;
    font-weight: 500;
    font-size: ${({ theme }) => theme.fontSizesMap.xxxs}px;
    line-height: 1.2em;
    letter-spacing: 0;
  }

  ${CounterStyle} {
    opacity: ${(props) => (props.$active ? 1 : 0.8)};
  }
`;
