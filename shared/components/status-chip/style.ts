import styled, { css } from 'styled-components';

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
  width: fit-content;
  padding: 4px 12px;
  text-align: center;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background: color-mix(in srgb, currentColor 15%, transparent);

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 700;
  text-transform: capitalize;
  ${(props) => variants[props.$variant || 'default']}
`;
