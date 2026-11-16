import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import dappnode from 'assets/partners/simple-staking/dappnode.svg';
import ethDocker from 'assets/partners/simple-staking/eth-docker.svg';
import ethereumOnArm from 'assets/partners/simple-staking/ethereum-on-arm.svg';
import ethpillar from 'assets/partners/simple-staking/ethpillar.svg';
import premia from 'assets/partners/simple-staking/premia.svg';
import sedge from 'assets/partners/simple-staking/sedge.svg';

export type LowCodePartner = {
  name: string;
  src: string;
  href?: string;
  matomoEvent?: MATOMO_CLICK_EVENTS_TYPES;
  starterPack: boolean;
};

export const LOW_CODE_PARTNERS: LowCodePartner[] = [
  {
    name: 'DAppNode',
    src: dappnode,
    href: 'https://docs.dappnode.io/docs/user/staking/ethereum/lsd-pools/lido',
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.partnerDappnode,
    starterPack: true,
  },
  { name: 'EthPillar', src: ethpillar, starterPack: true },
  {
    name: 'eth-docker',
    src: ethDocker,
    href: 'https://ethdocker.com/',
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.partnerEthdocker,
    starterPack: true,
  },
  {
    name: 'Sedge',
    src: sedge,
    href: 'https://www.nethermind.io/sedge',
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.partnerSedge,
    starterPack: true,
  },
  { name: 'Premia', src: premia, starterPack: true },
  { name: 'Ethereum on ARM', src: ethereumOnArm, starterPack: false },
];
