import styled from 'styled-components';

export const TabsStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  overflow: hidden;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  background: var(--lido-color-controlBg);
  border: 1px solid var(--lido-color-border);

  &:hover {
    border-color: var(--lido-color-borderHover);
  }
  &:focus-within {
    border-color: var(--lido-color-borderActive);
  }
`;

export const TabListStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  position: relative;
  border-bottom: 1px solid var(--lido-color-backgroundSecondary);
  width: fit-content;
  min-width: 100%;
  border-bottom: 1px solid var(--lido-color-border);
`;

export const TabButtonStyled = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  padding: ${({ theme }) => theme.spaceMap.sm}px
    ${({ theme }) => theme.spaceMap.md}px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 150ms ease;
  position: relative;

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 500;
  color: var(--lido-color-textSecondary);
  background: var(--lido-color-backgroundSecondary);

  &:not(:disabled):hover {
    color: var(--lido-color-text);
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }

  &[aria-current='page'] {
    font-weight: 700;
    color: var(--lido-color-text);
    background: initial;

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--lido-color-primary);
    }
  }
`;

export const TabPanelStyled = styled.div``;
