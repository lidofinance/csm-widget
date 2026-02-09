import { External, Link } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';

import { ReactComponent as Arrow } from 'assets/icons/arrow-right.svg';

export const ExternalIcon = styled(External)`
  margin-top: -1px;
`;

export const ArrowIcon = styled(Arrow)`
  margin-top: -1px;
`;

type LinkStyledProps = {
  $secondary?: boolean;
  $likeText?: boolean;
};

export const LinkStyled = styled(Link)<LinkStyledProps>`
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

  ${({ $likeText }) =>
    $likeText &&
    css`
      &,
      &:visited {
        color: var(--lido-color-text);
        text-decoration: underline;
      }
      &:hover {
        color: var(--lido-color-textSecondary);
      }
    `}
`;
