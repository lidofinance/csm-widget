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
