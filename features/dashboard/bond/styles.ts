import { Accordion } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components/stack/style';
import styled, { css } from 'styled-components';

export const RowTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const RowHeader = styled(StackStyle)`
  justify-content: space-between;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: baseline;
  }
`;

export const RowBody = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-auto-flow: row;
    grid-template: none;
  }
`;
export const DoubleColumnStyle = styled.div`
  grid-column: span 2;

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-column: initial;
  }
`;

export const AccordionStyle = styled(Accordion)`
  margin: 0;

  background: var(--lido-color-backgroundSecondary);
  /* padding: 20px; */

  & > div:first-child {
    padding: 20px;
  }

  & > div + div > div {
    padding: 0 20px 20px 20px;
  }

  p,
  ul,
  ol {
    margin: 0;
  }
`;

const badgeVariants = {
  default: css`
    color: var(--lido-color-text);
  `,
  warning: css`
    color: var(--lido-color-warning);
  `,
};

export const BadgeStyle = styled.div<{ $variant?: keyof typeof badgeVariants }>`
  width: fit-content;
  padding: 4px 8px;
  text-align: center;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  background: color-mix(in srgb, currentColor 15%, transparent);

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 700;
  ${(props) => badgeVariants[props.$variant || 'default']}
`;
