import styled, { css } from 'styled-components';
import { RateStatus } from './use-ethseer-api';
import { Text } from '@lidofinance/lido-ui';

export const Rate = styled(Text).attrs({ size: 'lg', weight: 700 })`
  flex: 0 0 auto;
`;

export const TipWrapper = styled.div<{ $danger: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: 12px;
  background: ${({ $danger }) =>
    $danger
      ? 'rgba(var(--lido-rgb-error), 0.1);'
      : 'var(--lido-color-background)'};

  color: ${({ $danger }) =>
    $danger ? 'var(--lido-color-error)' : 'var(--lido-color-textSecondary)'};
`;

const variants = {
  good: css`
    color: var(--lido-color-success);
    background: rgba(var(--lido-rgb-success), 0.1);
  `,
  semi: css`
    color: var(--lido-color-warning);
    background: rgba(var(--lido-rgb-warning), 0.1);
  `,
  bad: css`
    color: var(--lido-color-error);
    background: rgba(var(--lido-rgb-error), 0.1);
  `,
};

export const BadgeStyle = styled.div<{ $variant: RateStatus }>`
  flex: 0 0 auto;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  padding: 2px 4px;
  ${({ $variant }) => variants[$variant]}
`;
