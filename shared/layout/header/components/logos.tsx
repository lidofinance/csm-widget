import { Link, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { LogoLido } from 'shared/components';
import { LogoDivider, LogosStyle } from '../styles';
import { MODULE_METADATA } from 'consts';
import { config } from 'config';

export const Logos: FC = () => (
  <LogosStyle>
    <LogoLido />
    <LogoDivider />
    <Link href="/" target={undefined}>
      <Text as="span">{MODULE_METADATA[config.module].shortTitle}</Text>
    </Link>
  </LogosStyle>
);
