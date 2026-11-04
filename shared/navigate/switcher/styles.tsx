import styled from 'styled-components';
import { LocalLink } from '../local-link';

export const SwitchWrapper = styled.div<{
  $fadeStart: boolean;
  $fadeEnd: boolean;
}>`
  position: relative;
  overflow-x: auto;
  scrollbar-width: none;

  padding-inline: var(--layout-gutter, 20px);
  // bleeds into the layout gutters so the track can scroll edge to edge
  margin-inline: calc(-1 * var(--layout-gutter, 20px));

  --fade: 48px;
  --fade-start: ${({ $fadeStart }) => ($fadeStart ? 'var(--fade)' : '0px')};
  --fade-end: ${({ $fadeEnd }) => ($fadeEnd ? 'var(--fade)' : '0px')};
  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 var(--fade-start),
    #000 calc(100% - var(--fade-end)),
    transparent
  );
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent,
    #000 var(--fade-start),
    #000 calc(100% - var(--fade-end)),
    transparent
  );

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

export const DeleteKeysCardsStyle = styled.div`
  box-sizing: border-box;
  display: flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--lido-app-ui-color-border-default);
  border-radius: 20px;
  background-color: var(--lido-app-ui-color-background-default);

  @media (max-width: 899px) {
    flex-direction: column;
  }
`;

export const DeleteKeysCardStyle = styled(LocalLink)<{ $active: boolean }>`
  && {
    box-sizing: border-box;
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    padding: 12px;
    border: 1px solid
      ${({ $active }) =>
        $active ? 'var(--lido-app-ui-color-border-default)' : 'transparent'};
    border-radius: var(--lido-app-ui-border-radius-card);
    background-color: ${({ $active }) =>
      $active ? 'var(--lido-app-ui-color-background-surface)' : 'transparent'};
    color: var(--lido-app-ui-color-text-default);
    text-decoration: none;
    transition: background-color 0.2s ease;
  }

  &&:hover {
    background-color: ${({ $active }) =>
      $active
        ? 'var(--lido-app-ui-color-background-surface)'
        : 'var(--lido-app-ui-color-background-default-hover)'};
  }

  &&:focus-visible {
    outline: 2px solid var(--lido-app-ui-color-border-active);
    outline-offset: 2px;
  }
`;

export const DeleteKeysCardTitleStyle = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--lido-app-ui-font-family);
  font-size: var(--lido-app-ui-font-size-body);
  font-weight: var(--lido-app-ui-font-weight-semibold);
  line-height: var(--lido-app-ui-line-height-body);
  color: var(--lido-app-ui-color-text-default);
`;

export const DeleteKeysCardDescriptionStyle = styled.span`
  font-family: var(--lido-app-ui-font-family);
  font-size: var(--lido-app-ui-font-size-tooltip);
  line-height: var(--lido-app-ui-line-height-description);
  color: var(--lido-app-ui-color-text-tertiary);
`;
