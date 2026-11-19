import {
  IconArrowRight,
  MessageBox,
  MessageBoxVariant,
} from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import { AppLink } from 'shared/navigate/app-link';
import styled from 'styled-components';

export type MessageBoxLinkProps = {
  href: string;
  variant?: MessageBoxVariant;
  children: ReactNode;
  dataTestId?: { root?: string };
};

const LinkStyled = styled(AppLink)`
  display: block;
  width: 100%;
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid var(--lido-app-ui-color-border-active);
    outline-offset: 2px;
  }
`;

export const MessageBoxLink: FC<MessageBoxLinkProps> = ({
  href,
  variant,
  children,
  dataTestId,
}) => (
  <LinkStyled href={href} data-testid={dataTestId?.root}>
    <MessageBox variant={variant} action={<IconArrowRight aria-hidden />}>
      {children}
    </MessageBox>
  </LinkStyled>
);
