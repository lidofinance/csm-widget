import { Theme } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';

export type LaticeVariant = 'default' | 'secondary';

type InjectedProps = {
  theme: Theme;
};

const VARIANTS = {
  default: css<InjectedProps>`
    border: 1px solid var(--lido-color-border);
    border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;

    > * {
      padding: 12px 16px;

      &:not(:last-child) {
        border-bottom: 1px solid var(--lido-color-border);
      }
    }
  `,
  secondary: css<InjectedProps>`
    background-color: var(--lido-color-backgroundSecondary);
    border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;

    > * {
      padding: 16px;

      &:not(:last-child) {
        border-bottom: 1px solid var(--lido-color-foreground);
      }
    }
  `,
};

export const LaticeStyle = styled.div<{ $variant: LaticeVariant }>`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${(props) => VARIANTS[props.$variant]}

  label > svg + div {
    padding-left: 12px;

    p {
      font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
      line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
    }
  }
`;
