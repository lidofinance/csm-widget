import { FC } from 'react';
import { Dappnode, Ethdocker, PartnersStyle, Sedge, Stereum } from './styles';
import { Link } from '@lidofinance/lido-ui';

export const Partners: FC = () => (
  <PartnersStyle>
    <Link href="https://dappnode.com/" title="Dappnode">
      <Dappnode />
    </Link>
    <Link href="https://www.nethermind.io/sedge" title="Nethermind Sedge">
      <Sedge />
    </Link>
    <Link href="https://stereum.net/" title="Stereum">
      <Stereum />
    </Link>
    <Link href="https://eth-docker.net/" title="Eth Docker">
      <Ethdocker />
    </Link>
  </PartnersStyle>
);
