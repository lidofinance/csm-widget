import { External, Link } from '@lidofinance/lido-ui';
import { ComponentProps, FC } from 'react';
import { LinkStyle } from './style';

type LinkProps = Pick<ComponentProps<typeof Link>, 'href' | 'target'>;

export const ExternalIconLink: FC<LinkProps> = (props) => (
  <LinkStyle {...props}>
    <External />
  </LinkStyle>
);
