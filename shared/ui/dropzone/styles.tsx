import styled, { css } from 'styled-components';

type RootStyleProps = {
  $dragging: boolean;
  $error: boolean;
  $disabled: boolean;
};

export const RootStyle = styled.div<RootStyleProps>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
  padding: 16px;
  border: 1px solid var(--lido-app-ui-color-border-default);
  border-radius: var(--lido-app-ui-border-radius-card);
  background-color: var(--lido-app-ui-color-background-default);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  ${({ $dragging }) =>
    $dragging &&
    css`
      border-style: dashed;
      border-color: var(--lido-app-ui-color-border-active);
      background-color: var(--lido-app-ui-color-tint-active);
    `}

  ${({ $error }) =>
    $error &&
    css`
      border-color: var(--lido-app-ui-color-border-error);
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
    `}

  @media (max-width: 599px) {
    padding: 12px;
  }
`;

export const BodyStyle = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-height: 200px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--lido-app-ui-color-border-active);
    outline-offset: -2px;
  }
`;

export const PlaceholderStyle = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 32px;
  color: var(--lido-app-ui-color-text-tertiary);
  font-family: var(--lido-app-ui-font-family);
  font-size: var(--lido-app-ui-font-size-label);
  font-weight: var(--lido-app-ui-font-weight-regular);
  line-height: 24px;
  letter-spacing: var(--lido-app-ui-letter-spacing-label);
  text-align: center;
  pointer-events: none;
`;

export const TextareaStyle = styled.textarea<{ $filled: boolean }>`
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-height: 200px;
  padding: 0;
  border: none;
  outline: none;
  background-color: transparent;
  color: transparent;
  caret-color: var(--lido-app-ui-color-text-default);
  pointer-events: none;
  cursor: text;
  resize: none;

  ${({ $filled }) =>
    $filled &&
    css`
      color: var(--lido-app-ui-color-text-default);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
      line-height: var(--lido-app-ui-line-height-description);
      pointer-events: auto;
    `}

  &:disabled {
    cursor: not-allowed;
  }
`;

export const FileInputStyle = styled.input`
  display: none;
`;

export const ErrorTextStyle = styled.p`
  margin: 0;
  color: var(--lido-app-ui-color-text-error);
  font-family: var(--lido-app-ui-font-family);
  font-size: var(--lido-app-ui-font-size-tooltip);
  font-weight: var(--lido-app-ui-font-weight-regular);
  line-height: var(--lido-app-ui-line-height-description);
  letter-spacing: var(--lido-app-ui-letter-spacing-tooltip);
`;
