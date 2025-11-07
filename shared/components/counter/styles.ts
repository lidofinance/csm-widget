import { CURVE_VARIANTS } from 'shared/node-operator/curve-badge/styles';
import styled, { css } from 'styled-components';

export const COUNTER_VARIANTS = {
  default: css`
    background: var(--lido-color-backgroundSecondary);
  `,
  warning: css`
    background: var(--lido-color-error);
  `,
  operators: css`
    background: var(--lido-color-accentControlBg);
  `,
  ...CURVE_VARIANTS,
} as const;
export type COUNTER_VARIANTS = keyof typeof COUNTER_VARIANTS;

type Props = {
  $variant?: COUNTER_VARIANTS;
};

export const CounterStyle = styled.span<Props>`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  padding: 4px 5px;
  margin-block: -4px;
  line-height: 1;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 700;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  align-self: center;

  color: var(--lido-color-text);
  text-transform: capitalize;

  ${({ $variant = 'default' }) => ($variant ? COUNTER_VARIANTS[$variant] : '')}
`;
