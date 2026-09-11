import styled from 'styled-components';
import { LocalLink } from '../local-link';

export const SwitchWrapper = styled.div`
  position: relative;
  overflow-x: auto;
  scrollbar-width: none;

  // bleeds into the layout gutters so the track can scroll edge to edge;
  // width must stay auto for the negative margins to widen rather than shift it
  margin-inline: calc(-1 * var(--layout-gutter, 20px));
  padding-inline: var(--layout-gutter, 20px);

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Track = styled.div`
  position: relative;
  width: max-content;
  margin-inline: auto;
  height: 44px;
  background-color: var(--lido-color-backgroundDarken);
  border-radius: 22px;
  display: flex;
  align-items: center;
  user-select: none;

  :hover {
    cursor: pointer;
  }
`;

export const Handle = styled.div`
  height: 40px;
  background-color: var(--lido-color-foreground);
  border-radius: 20px;
  position: absolute;
  top: 2px;
  transition:
    left 0.3s ease,
    width 0.3s ease;
  z-index: 1;
`;

// Not wrapping <a> inside <a> in IPFS mode
// Also avoid problems with migrate to Next v13
// see: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#link-component
export const SwitchItemStyled = styled(LocalLink)<{
  $active: boolean;
  $warning?: boolean;
}>`
  z-index: 2;
  margin: 0;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  transition: opacity 0.3s ease;
  flex: 0 0 134px;
  display: flex;
  align-items: center;
  text-decoration: none;
  justify-content: center;
  height: 100%;

  font-size: ${({ theme }) => theme.fontSizesMap.xxxs}px;
  line-height: 2.4em;
  font-weight: 800;
  text-align: center;
  letter-spacing: 0.3px;
  text-transform: uppercase;

  color: ${({ $warning }) =>
    $warning ? `var(--lido-color-error)` : `var(--lido-color-text)`};

  &:hover {
    color: ${({ $warning }) =>
      $warning ? `var(--lido-color-error)` : `var(--lido-color-text)`};
    opacity: 1;
  }

  &:visited {
    color: ${({ $warning }) =>
      $warning ? `var(--lido-color-error)` : `var(--lido-color-text)`};
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    flex: 0 0 auto;
    padding-inline: 24px;
    white-space: nowrap;
  }
`;
