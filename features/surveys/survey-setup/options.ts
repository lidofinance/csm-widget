import { COUNTRIES } from './countries';

type Options = { value: string; label: string }[];

export const DVT_OPTIONS: Options = [
  { value: 'no', label: 'No' },
  { value: 'ssv', label: 'SSV' },
  { value: 'obol', label: 'Obol' },
  { value: 'safestake', label: 'SafeStake' },
  { value: 'other', label: 'Other' },
];
export const TOOL_OPTIONS: Options = [
  { value: 'other', label: 'DIY / Other' },
  { value: 'ethdocker', label: 'Eth-docker' },
  { value: 'dappnode', label: 'Dappnode' },
  { value: 'ethpillar', label: 'EthPillar' },
  { value: 'stereum', label: 'Stereum' },
  { value: 'sedge', label: 'Sedge' },
  { value: 'rocketpool', label: 'Rocketpool SmartNode' },
];
export const EL_CLIENT_OPTIONS: Options = [
  { value: 'geth', label: 'Geth' },
  { value: 'nethermind', label: 'Nethermind' },
  { value: 'besu', label: 'Besu' },
  { value: 'erigon', label: 'Erigon' },
  { value: 'reth', label: 'Reth' },
];
export const CL_CLIENT_OPTIONS: Options = [
  { value: 'prysm', label: 'Prysm' },
  { value: 'lighthouse', label: 'Lighthouse' },
  { value: 'teku', label: 'Teku' },
  { value: 'nimbus', label: 'Nimbus' },
  { value: 'lodestar', label: 'Lodestar' },
  { value: 'grandine', label: 'Grandine' },
];
export const VALIDATOR_CLIENT_OPTIONS: Options = [
  { value: 'prysm', label: 'Prysm' },
  { value: 'lighthouse', label: 'Lighthouse' },
  { value: 'teku', label: 'Teku' },
  { value: 'nimbus', label: 'Nimbus' },
  { value: 'lodestar', label: 'Lodestar' },
  { value: 'vouch', label: 'Vouch' },
  { value: 'vero', label: 'Vero' },
  { value: 'grandine', label: 'Grandine' },
  { value: 'ssv', label: 'SSV' },
];
export const SERVER_TYPE_OPTIONS: Options = [
  { value: 'public cloud', label: 'Public Cloud' },
  { value: 'managed server', label: 'Managed Server' },
  { value: 'dedicated server', label: 'Dedicated Server' },
  { value: 'colocation', label: 'Colocation' },
  { value: 'on-premises server', label: 'On-Premises Server' },
  { value: 'home node', label: 'Home Node' },
];
export const REMOTE_SIGNER_OPTIONS: Options = [
  { value: 'no', label: 'No' },
  { value: 'web3signer', label: 'Web3Signer' },
  { value: 'dirk', label: 'Dirk' },
  { value: 'other', label: 'Other' },
];
export const COUNTRY_OPTIONS: Options = COUNTRIES.map((country) => ({
  value: country['alpha-2'].toLowerCase(),
  label: country.name,
}));
