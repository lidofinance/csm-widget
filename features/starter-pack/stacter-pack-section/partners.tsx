import { FC } from 'react';
import { Dappnode, Ethdocker, PartnersStyle, Sedge, Stereum } from './styles';
import { Link } from '@lidofinance/lido-ui';

export const Partners: FC = () => (
  <PartnersStyle>
    <Link
      href="https://docs.dappnode.io/docs/user/staking/ethereum/lsd-pools/lido"
      title="Dappnode"
    >
      <Dappnode />
    </Link>
    <Link href="https://www.nethermind.io/sedge" title="Nethermind Sedge">
      <Sedge />
    </Link>
    <Link href="https://stereum.net/" title="Stereum">
      <Stereum />
    </Link>
    <Link href="https://github.com/lidofinance/eth-docker" title="Eth Docker">
      <Ethdocker />
    </Link>
  </PartnersStyle>
);
