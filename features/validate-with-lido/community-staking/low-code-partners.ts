import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import dappnode from 'assets/partners/simple-staking/dappnode.svg';
import ethDocker from 'assets/partners/simple-staking/eth-docker.svg';
import ethereumOnArm from 'assets/partners/simple-staking/ethereum-on-arm.svg';
import ethpillar from 'assets/partners/simple-staking/ethpillar.svg';
import stereum from 'assets/partners/simple-staking/stereum.svg';
import sedge from 'assets/partners/simple-staking/sedge.svg';

export type LowCodePartner = {
  name: string;
  src: string;
  href: string;
  matomoEvent?: MATOMO_CLICK_EVENTS_TYPES;
};

export const LOW_CODE_PARTNERS: LowCodePartner[] = [
  {
    name: 'DAppNode',
    src: dappnode,
    href: 'https://docs.dappnode.io/docs/user/staking/ethereum/lsd-pools/lido',
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.partnerDappnode,
  },
  {
    name: 'EthPillar',
    src: ethpillar,
    href: 'https://docs.coincashew.com/ethpillar',
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.partnerEthPillar,
  },
  {
    name: 'eth-docker',
    src: ethDocker,
    href: 'https://ethdocker.com/',
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.partnerEthdocker,
  },
  {
    name: 'Sedge',
    src: sedge,
    href: 'https://www.nethermind.io/sedge',
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.partnerSedge,
  },
  {
    name: 'Stereum',
    src: stereum,
    href: 'https://stereum.com/',
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.partnerStereum,
  },
  {
    name: 'Ethereum on ARM',
    src: ethereumOnArm,
    href: 'https://ethereum-on-arm-documentation.readthedocs.io/en/latest/',
  },
];
