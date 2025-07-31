import styled, { css } from 'styled-components';

const variants = {
  notice: css`
    background: var(--lido-color-background);
    color: var(--lido-color-text);
  `,
  warning: css`
    background: rgba(var(--lido-rgb-warning), 0.1);
    color: var(--lido-color-warning);
  `,
};

export type BlockVariant = keyof typeof variants;

export const WarningBlockStyle = styled.div<{
  $variant?: BlockVariant;
}>`
  padding: 12px;

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  ${({ $variant = 'warning' }) => variants[$variant] || ''}
`;

export const NoteTypeStyle = styled.b`
  text-transform: capitalize;
  font-weight: 700;
`;
