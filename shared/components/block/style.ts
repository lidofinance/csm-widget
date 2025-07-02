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

export type BlockColor = keyof typeof COLOR_VARIANTS;

export const BlockStyle = styled(Block)<{ accent?: BlockColor }>`
  ${({ accent }) => (accent ? COLOR_VARIANTS[accent] : '')}
`;
