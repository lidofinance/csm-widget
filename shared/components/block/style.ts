import { Block } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';

const COLOR_VARIANTS = {
  error: css`
    background: rgba(var(--lido-rgb-error), 0.1);
  `,
  warning: css`
    background: rgba(var(--lido-rgb-warning), 0.1);
  `,
  success: css`
    background: rgba(var(--lido-rgb-success), 0.1);
  `,
};

const PADDING_VARIANTS = {
  none: css`
    padding: 0;
  `,
  sm: css`
    padding: 8px;
  `,
  md: css`
    padding: 16px;
  `,
  lg: css`
    padding: 32px;
  `,
};

export type BlockColor = keyof typeof COLOR_VARIANTS;

export const BlockStyle = styled(Block)<{
  accent?: BlockColor;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  overflowHidden?: boolean;
}>`
  ${({ accent }) => (accent ? COLOR_VARIANTS[accent] : '')}
  ${({ padding: $padding }) => ($padding ? PADDING_VARIANTS[$padding] : '')}
  ${({ overflowHidden }) => overflowHidden && 'overflow: hidden;'}
`;

export const HatBlockStyle = styled(BlockStyle)`
  margin-bottom: -52px;
  padding-bottom: 52px;

  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;
