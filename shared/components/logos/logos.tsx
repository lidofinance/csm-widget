import { LidoLogo } from '@lidofinance/lido-ui';
import Link from 'next/link';
import { FC } from 'react';

import { LogoLidoStyle } from './styles';

export const LogoLido: FC = () => (
  <LogoLidoStyle>
    <Link href="https://lido.fi">
      <LidoLogo data-testid="lidoLogo" />
    </Link>
  </LogoLidoStyle>
);
