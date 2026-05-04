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
  primary: css`
    color: var(--lido-color-primary);
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

export const ChipStyle = styled.div<{
  $variant?: Variants;
  $squared?: boolean;
  $pale?: boolean;
}>`
  --pale: ${({ $pale }) => ($pale ? '10%' : '15%')};

  display: flex;
  gap: 6px;
  align-items: center;

  width: fit-content;
  padding: 4px 12px;
  text-align: center;
  white-space: nowrap;

  border-radius: ${({ theme, $squared }) =>
    $squared
      ? `${theme.borderRadiusesMap.md}px`
      : `${theme.borderRadiusesMap.xl}px`};
  background: color-mix(in srgb, currentColor var(--pale), transparent);

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 700;
  ${(props) => variants[props.$variant || 'default']}

  ${StyledPriorityChip} {
    margin-right: -4px;
  }
`;
