import { IconLink, TextLink } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

import Arrow from 'assets/icons/arrow-right.svg?react';

export const ExternalIcon = styled(IconLink)`
  margin-top: -1px;
`;

export const ArrowIcon = styled(Arrow)`
  margin-top: -1px;
`;

type LinkStyledProps = {
  $inline?: boolean;
  $secondary?: boolean;
};

export const LinkStyled = styled(TextLink).attrs<LinkStyledProps>(
  ({ $secondary }) => ({
    size: 'inherit',
    variant: $secondary ? 'secondary' : 'primary',
  }),
)<LinkStyledProps>`
  && {
    display: ${({ $inline }) => ($inline ? 'inline' : 'inline-flex')};
    letter-spacing: inherit;
  }
`;
