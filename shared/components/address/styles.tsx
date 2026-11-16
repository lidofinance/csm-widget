import styled, { css } from 'styled-components';
import { LinkStyled } from '../matomo-link/styles';
import { TypographyColor } from '@lidofinance/lido-app-ui';

export const AddressContainerStyle = styled.span<{
  $big?: boolean;
  $monospace?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;

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
          height: 20px;
        }
      `}
  }
`;

const COLORS: Record<TypographyColor, string> = {
  default: 'var(--lido-app-ui-color-text-default)',
  secondary: 'var(--lido-app-ui-color-text-secondary)',
  tertiary: 'var(--lido-app-ui-color-text-tertiary)',
  neutral: 'var(--lido-app-ui-color-text-neutral)',
  active: 'var(--lido-app-ui-color-text-active)',
  success: 'var(--lido-app-ui-color-text-success)',
  warning: 'var(--lido-app-ui-color-text-warning)',
  error: 'var(--lido-app-ui-color-text-error)',
  info: 'var(--lido-app-ui-color-text-info)',
  inverse: 'var(--lido-app-ui-color-text-inverse)',
  disabled: 'var(--lido-app-ui-color-text-disabled)',
};

export const PubkeyContainerStyle = styled(AddressContainerStyle)<{
  $color?: TypographyColor;
}>`
  ${({ $monospace = true }) =>
    $monospace &&
    css`
      font-family: 'Fira Code', monospace;
      font-size: 12px;
    `}
  color: ${({ $color = 'default' }) => COLORS[$color]};
`;

export const Avatar = styled.img<{
  diameter: number;
}>`
  border-radius: 50%;
  width: ${({ diameter }) => diameter}px;
  height: ${({ diameter }) => diameter}px;
`;
