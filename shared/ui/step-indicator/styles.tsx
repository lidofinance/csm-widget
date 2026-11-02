import { IconCheck } from '@lidofinance/lido-app-ui';
import styled, { css } from 'styled-components';

export type StepStatus = 'done' | 'current' | 'upcoming';

export const ListStyle = styled.ol`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 599px) {
    flex-wrap: nowrap;
    overflow-x: auto;
  }
`;

export const StepStyle = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CircleStyle = styled.span<{ $status: StepStatus }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: var(--lido-app-ui-border-radius-pill);
  font-family: var(--lido-app-ui-font-family);
  font-size: 12px;
  font-weight: var(--lido-app-ui-font-weight-semibold);
  color: var(--lido-app-ui-color-text-inverse);
  background-color: ${({ $status }) =>
    $status === 'current'
      ? 'var(--lido-app-ui-color-icons-default)'
      : 'var(--lido-app-ui-color-icons-tertiary)'};
`;

export const CheckIconStyle = styled(IconCheck)`
  width: 16px;
  height: 16px;
  color: var(--lido-app-ui-color-text-inverse);
`;

export const LabelStyle = styled.span<{ $status: StepStatus }>`
  font-family: var(--lido-app-ui-font-family);
  font-size: var(--lido-app-ui-font-size-label);
  font-weight: var(--lido-app-ui-font-weight-semibold);
  line-height: var(--lido-app-ui-line-height-label);
  letter-spacing: var(--lido-app-ui-letter-spacing-label);
  white-space: nowrap;
  color: ${({ $status }) =>
    $status === 'current'
      ? 'var(--lido-app-ui-color-text-default)'
      : 'var(--lido-app-ui-color-text-tertiary)'};

  ${({ $status }) =>
    $status !== 'current' &&
    css`
      @media (max-width: 599px) {
        display: none;
      }
    `}
`;

export const ConnectorStyle = styled.span`
  display: block;
  width: 36px;
  height: 1px;
  margin-left: 12px;
  background-color: var(--lido-app-ui-color-border-default);
`;
