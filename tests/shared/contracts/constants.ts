import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import {
  CONTRACT_NAMES,
  COMMON_ADDRESSES,
  MODULE_CONFIG,
  MODULE_NAME,
} from '@lidofinance/lido-csm-sdk';

export type Hex = `0x${string}`;
export type ChainName = 'hoodi' | 'mainnet';
export type ModuleName = 'csm' | 'cm' | 'csm02';

export type GateSelector =
  'po' | 'pto' | 'pgo' | 'do' | 'eeo' | 'iodc' | 'iodcp' | 'ics' | 'idvtc';

export type Addresses = {
  module: Hex;
  accounting: Hex;
  metaRegistry?: Hex;
  gates: Partial<Record<GateSelector, Hex>>;
};

const CHAIN_ID = {
  mainnet: CHAINS.Mainnet,
  hoodi: CHAINS.Hoodi,
} as const satisfies Record<ChainName, CHAINS>;

const SDK_MODULE: Record<ModuleName, MODULE_NAME> = {
  csm: MODULE_NAME.CSM,
  cm: MODULE_NAME.CM,
  csm02: MODULE_NAME.CSM_02,
};

const GATE_CONTRACT: Record<GateSelector, CONTRACT_NAMES> = {
  ics: CONTRACT_NAMES.icsGate,
  idvtc: CONTRACT_NAMES.idvtcGate,
  po: CONTRACT_NAMES.curatedGatePO,
  pto: CONTRACT_NAMES.curatedGatePTO,
  pgo: CONTRACT_NAMES.curatedGatePGO,
  do: CONTRACT_NAMES.curatedGateDO,
  eeo: CONTRACT_NAMES.curatedGateEEO,
  iodc: CONTRACT_NAMES.curatedGateIODC,
  iodcp: CONTRACT_NAMES.curatedGateIODCP,
};

export const stakingRouter = (chain: ChainName): Hex => {
  const address =
    COMMON_ADDRESSES[CHAIN_ID[chain]][CONTRACT_NAMES.stakingRouter];
  if (!address) throw new Error(`No StakingRouter address on ${chain}`);
  return address;
};

export const addresses = (
  chain: ChainName,
  module: ModuleName,
): Addresses | undefined => {
  const contracts =
    MODULE_CONFIG[SDK_MODULE[module]][CHAIN_ID[chain]]?.contractAddresses;
  if (!contracts) return undefined;

  const moduleAddress =
    module === 'cm'
      ? contracts[CONTRACT_NAMES.curatedModule]
      : contracts[CONTRACT_NAMES.csModule];

  const accounting = contracts[CONTRACT_NAMES.accounting];
  if (!moduleAddress || !accounting) return undefined;

  return {
    module: moduleAddress,
    accounting,
    metaRegistry: contracts[CONTRACT_NAMES.metaRegistry],
    gates: Object.fromEntries(
      Object.entries(GATE_CONTRACT)
        .map(([selector, name]) => [selector, contracts[name]])
        .filter(([, address]) => address),
    ) as Partial<Record<GateSelector, Hex>>,
  };
};
