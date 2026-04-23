import { Text } from '@lidofinance/lido-ui';
import { config } from 'config';
import { MODULE_METADATA } from 'consts';
import { FC } from 'react';
import { LogoLido } from 'shared/components';
import { LogoDivider, LogosStyle } from '../styles';

export const Logos: FC = () => (
  <LogosStyle href="/" target={undefined}>
    <LogoLido />
    <LogoDivider />
    <Text as="span">{MODULE_METADATA[config.module].shortTitle}</Text>
  </LogosStyle>
);
