import styled, { css } from 'styled-components';
import { LinkStyled } from '../matomo-link/styles';
import { StackStyle } from '../stack/style';

export const AddressContainerStyle = styled(StackStyle).attrs({
  $gap: 'xs',
  $align: 'center',
})<{ $big?: boolean }>`
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
