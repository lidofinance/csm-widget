import { Text } from '@lidofinance/lido-ui';
import { moduleMeta } from 'consts';
import { FC } from 'react';
import { LogoLido } from 'shared/components';
import { LogoDivider, LogosStyle } from '../styles';

export const Logos: FC = () => (
  <LogosStyle href="/" target={undefined}>
    <LogoLido />
    <LogoDivider />
    <Text as="span">{moduleMeta.shortTitle}</Text>
  </LogosStyle>
);
