import { Address } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';
import { LinkStyled } from '../matomo-link/styles';
import { StackStyle } from '../stack/style';

export const AddressStyle = styled(Address)<{ $bold?: boolean }>`
  ${({ $bold }) =>
    $bold &&
    css`
      font-weight: bold;
    `}
`;

export const AddressContainerStyle = styled(StackStyle).attrs({
  $gap: 'xs',
  $align: 'center',
})<{ $bold?: boolean }>`
  ${LinkStyled} {
    svg {
      display: inline-flex;
      flex-shrink: 0;
    }

    ${({ $bold }) =>
      !$bold &&
      css`
        &,
        &:visited {
          color: var(--lido-color-textSecondary);
        }
        &:hover {
          color: var(--lido-color-primaryHover);
        }

        svg {
          width: 20px;
        }
      `}
  }
`;
