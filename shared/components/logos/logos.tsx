import { LidoLogo } from '@lidofinance/lido-ui';
import Link from 'next/link';
import { FC, HTMLAttributes, SVGProps } from 'react';

import { LogoLidoStyle } from './styles';

export type LogoComponent = FC<Omit<SVGProps<SVGSVGElement>, 'ref'>>;

export const LogoLido: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <LogoLidoStyle {...props}>
    <Link href="https://lido.fi">
      <LidoLogo data-testid="lidoLogo" />
    </Link>
  </LogoLidoStyle>
);
