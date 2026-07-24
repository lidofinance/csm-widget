import styled, { css } from 'styled-components';

export type Variants = keyof typeof variants;

const variants = {
  default: css`
    color: var(--lido-color-text);
  `,
  success: css`
    color: var(--lido-color-success);
  `,
  error: css`
    color: var(--lido-color-error);
  `,
  pending: css`
    color: var(--lido-color-textSecondary);
  `,
};

export const ChipStyle = styled.div<{ $variant?: Variants }>`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spaceMap.xs}px;

  width: fit-content;
  padding: 2px 12px;
  align-items: center;
  white-space: nowrap;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background: color-mix(in srgb, currentColor 15%, transparent);

  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 700;
  ${(props) => variants[props.$variant || 'default']}
`;
