import styled, { css } from 'styled-components';
import { StyledPriorityChip } from '../chip/styles';

export type Variants = keyof typeof variants;

const variants = {
  default: css`
    color: var(--lido-color-text);
  `,
  secondary: css`
    color: var(--lido-color-textSecondary);
  `,
  success: css`
    color: var(--lido-color-success);
  `,
  error: css`
    color: var(--lido-color-error);
  `,
  warning: css`
    color: var(--lido-color-warning);
  `,
};

export const StatusStyle = styled.div<{ $variant?: Variants }>`
  display: flex;
  gap: 6px;
  align-items: center;

  width: fit-content;
  padding: 4px 12px;
  text-align: center;
  white-space: nowrap;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background: color-mix(in srgb, currentColor 15%, transparent);

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 700;
  ${(props) => variants[props.$variant || 'default']}

  ${StyledPriorityChip} {
    margin-right: -4px;
  }
`;
