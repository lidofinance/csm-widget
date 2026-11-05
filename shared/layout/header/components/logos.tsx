import { Text } from '@lidofinance/lido-ui';
import { useModuleMeta } from 'shared/hooks';
import { FC } from 'react';
import { LogoLido } from 'shared/components';
import { LogoDivider, LogosStyle } from '../styles';

export const Logos: FC = () => {
  const moduleMeta = useModuleMeta();

  return (
    <LogosStyle href="/" target={undefined}>
      <LogoLido />
      <LogoDivider />
      <Text as="span">{moduleMeta.shortTitle}</Text>
    </LogosStyle>
  );
};
