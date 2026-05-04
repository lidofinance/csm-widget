import { Accordion, Check as CheckIcon } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components';
import styled, { css } from 'styled-components';

import { ReactComponent as AlertIcon } from 'assets/icons/alert.svg';

export const Alert = styled(AlertIcon)`
  width: 12px;
  height: 12px;
`;

export const Check = styled(CheckIcon)`
  width: 20px;
  height: 20px;
  margin-inline: -4px;
`;

export const TitleStyle = styled(StackStyle).attrs({
  $direction: 'row',
  $gap: 'xs',
  $align: 'center',
  $justify: 'space-between',
})`
  line-height: 24px;
`;

export const VARIANTS = {
  active: css`
    --color: var(--lido-color-text);
  `,
  warning: css`
    --weight: 700;
    --color: var(--lido-color-warning);
    background: color-mix(in srgb, var(--color) 10%, transparent);
    padding-block: ${({ theme }) => theme.spaceMap.sm}px;
  `,
  error: css`
    --weight: 700;
    --color: var(--lido-color-error);
    background: color-mix(in srgb, var(--color) 10%, transparent);
    padding-block: ${({ theme }) => theme.spaceMap.sm}px;
  `,
};

export const WrapperStyle = styled.div<{
  $variant?: keyof typeof VARIANTS;
}>`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding-inline: ${({ theme }) => theme.spaceMap.md}px;

  ${({ $variant }) => $variant && VARIANTS[$variant]}

  ${TitleStyle} {
    color: var(--color, var(--lido-color-textSecondary));
    font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
    font-weight: var(--weight, 400);

    & b {
      font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
    }
  }
`;

export const AccordionStyle = styled(Accordion)`
  margin: 0;

  & > div:first-child,
  & > div + div > div {
    padding: 12px 0px 0px;
  }
`;
