import {
  IconArrowRight,
  MessageBox,
  MessageBoxVariant,
} from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import { AppLink } from 'shared/navigate/app-link';
import s from './message-box-link.module.css';

export type MessageBoxLinkProps = {
  href: string;
  variant?: MessageBoxVariant;
  children: ReactNode;
  dataTestId?: { root?: string };
};

export const MessageBoxLink: FC<MessageBoxLinkProps> = ({
  href,
  variant,
  children,
  dataTestId,
}) => (
  <AppLink className={s.link} href={href} data-testid={dataTestId?.root}>
    <MessageBox variant={variant} action={<IconArrowRight aria-hidden />}>
      {children}
    </MessageBox>
  </AppLink>
);
