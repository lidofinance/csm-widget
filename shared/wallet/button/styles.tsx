import styled from 'styled-components';

export const WalletButtonStyle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  box-sizing: border-box;
  padding: 4px 12px 4px 4px;

  font-family: var(--lido-app-ui-font-family);
  font-size: 14px;
  font-weight: var(--lido-app-ui-font-weight-regular);
  line-height: 24px;
  color: var(--lido-app-ui-color-text-default);

  background: var(--lido-app-ui-color-background-surface);
  border: 1px solid var(--lido-app-ui-color-border-default);
  border-radius: 40px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background: var(--lido-app-ui-color-background-surface-hover);
    border-color: var(--lido-app-ui-color-border-active);
  }

  &:focus-visible {
    outline: 2px solid var(--lido-app-ui-color-border-active);
    outline-offset: 2px;
  }
`;
