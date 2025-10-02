import styled, { css } from 'styled-components';
import { RateStatus } from './use-ethseer-api';
import { Accordion, Text } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components';

export const Rate = styled(Text).attrs({ size: 'lg', weight: 700 })`
  flex: 0 0 auto;
`;

export const TipWrapper = styled.div<{ $danger?: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: 12px;
  background: ${({ $danger = false }) =>
    $danger
      ? 'rgba(var(--lido-rgb-error), 0.1);'
      : 'var(--lido-color-background)'};

  color: ${({ $danger = false }) =>
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

// PerformanceMetricMethodology styles

export const AccordionWrapper = styled(Accordion)`
  background: var(--lido-color-backgroundSecondary);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;

  & > div:first-child {
    padding: ${({ theme }) => theme.spaceMap.lg}px;
  }

  & > div + div > div {
    padding: 0 ${({ theme }) => theme.spaceMap.lg}px
      ${({ theme }) => theme.spaceMap.lg}px
      ${({ theme }) => theme.spaceMap.lg}px;
  }

  & > div + div > div > div {
    color: var(--lido-color-text);
    line-height: 20px;
  }

  p,
  ul {
    margin: 0;
  }

  sub {
    line-height: 13px;
  }
`;

export const FormulaWrapper = styled(StackStyle).attrs({
  $gap: 'xs',
  $align: 'center',
})`
  flex-wrap: wrap;
`;

export const FormulaBadge = styled.span`
  background: var(--lido-color-borderLight);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  padding: 4px 8px;
`;

export const FormulaOperator = styled.span`
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  padding: 0 2px;
`;
