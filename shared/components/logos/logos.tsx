import { LidoLogo, Link } from '@lidofinance/lido-ui';
import { FC } from 'react';

import { LogoLidoStyle } from './styles';

export const LogoLido: FC = () => (
  <LogoLidoStyle>
    <Link href="https://lido.fi">
      <LidoLogo data-testid="lidoLogo" as="span" />
    </Link>
  </LogoLidoStyle>
);
