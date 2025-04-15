import { Link, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { LogoLido } from 'shared/components';
import { LogoDivider, LogosStyle } from '../styles';

export const Logos: FC = () => (
  <LogosStyle>
    <LogoLido />
    <LogoDivider />
    <Link href="/" target={undefined}>
      <Text as="span">CSM</Text>
    </Link>
  </LogosStyle>
);
