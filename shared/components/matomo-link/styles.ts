import { External, Link } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';

import { ReactComponent as Arrow } from 'assets/icons/arrow-right.svg';

export const ExternalIcon = styled(External)`
  margin-top: -1px;
`;

export const ArrowIcon = styled(Arrow)`
  margin-top: -1px;
`;

export const LinkStyled = styled(Link)<{
  $secondary?: boolean;
  $rawIcon?: boolean;
}>`
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

  ${({ $rawIcon }) =>
    $rawIcon
      ? ''
      : css`
          svg {
            width: 20px;
            height: 20px;
          }
        `}
`;
