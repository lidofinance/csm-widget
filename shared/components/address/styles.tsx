import styled, { css } from 'styled-components';
import { LinkStyled } from '../matomo-link/styles';
import { StackStyle } from '../stack/style';
import { ComponentProps } from 'react';
import { Text } from '@lidofinance/lido-ui';

export const AddressContainerStyle = styled(StackStyle).attrs({
  $gap: 'xs',
  $align: 'center',
})<{ $big?: boolean; $monospace?: boolean }>`
  display: inline-flex;

  > span > span {
    font-weight: inherit;
  }

  ${LinkStyled} {
    svg {
      display: inline-flex;
      flex-shrink: 0;
    }

    ${({ $big }) =>
      !$big &&
      css`
        svg {
          width: 20px;
        }
      `}
  }
`;

const VARIANTS = {
  default: css`
    color: var(--lido-color-text);
  `,
  secondary: css`
    color: var(--lido-color-secondary);
  `,
  primary: css`
    color: var(--lido-color-primary);
  `,
  error: css`
    color: var(--lido-color-error);
  `,
  warning: css`
    color: var(--lido-color-warning);
  `,
  success: css`
    color: var(--lido-color-success);
  `,
};

export const PubkeyContainerStyle = styled(AddressContainerStyle)<{
  $color?: ComponentProps<typeof Text>['color'];
}>`
  font-family: 'Fira Code', monospace;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  ${({ $color = 'default' }) => $color && VARIANTS[$color]}
`;

export const Avatar = styled.img<{
  diameter: number;
}>`
  border-radius: 50%;
  width: ${({ diameter }) => diameter}px;
  height: ${({ diameter }) => diameter}px;
`;
