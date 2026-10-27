import { External } from '@lidofinance/lido-ui';
import { TextLink } from '@lidofinance/lido-app-ui';
import styled, { css } from 'styled-components';

import { ReactComponent as Arrow } from 'assets/icons/arrow-right.svg';

export const ExternalIcon = styled(External)`
  margin-top: -1px;
`;

export const ArrowIcon = styled(Arrow)`
  margin-top: -1px;
`;

type LinkStyledProps = {
  $inline?: boolean;
  $secondary?: boolean;
  $likeText?: boolean;
};

export const LinkStyled = styled(TextLink)<LinkStyledProps>`
  && {
    display: ${({ $inline }) => ($inline ? 'inline' : 'inline-flex')};
    font: inherit;
    letter-spacing: inherit;

    ${({ $secondary }) =>
      $secondary &&
      css`
        --local-color: var(--lido-color-textSecondary);
        --local-color-hover: var(--lido-color-primaryHover);
      `}

    ${({ $likeText }) =>
      $likeText &&
      css`
        --local-color: var(--lido-color-text);
        --local-color-hover: var(--lido-color-textSecondary);
        text-decoration: underline;
      `}
  }
`;
