import styled, { css } from 'styled-components';
import { LinkStyled } from '../matomo-link/styles';
import { StackStyle } from '../stack/style';

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

  ${({ $monospace }) =>
    $monospace &&
    css`
      font-family: 'Fira Code', monospace;
      font-optical-sizing: auto;
      font-feature-settings:
        'liga' off,
        'clig' off;
    `}
`;
