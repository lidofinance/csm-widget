import { Link } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';

export const LinkStyled = styled(Link)<{ $secondary?: boolean }>`
  display: inline-flex;
  align-items: center;

  ${({ $secondary }) =>
    $secondary &&
    css`
      &,
      &:visited {
        color: var(--lido-color-textSecondary);
      }
      &:hover {
        color: var(--lido-color-primaryHover);
      }
    `}
`;
