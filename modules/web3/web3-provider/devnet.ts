import { Address, isAddress } from 'viem';

import { CONTRACT_NAMES, CURATED_GATES } from '@lidofinance/lido-csm-sdk';
import { config } from 'config';

type DevnetJson = Record<string, unknown>;

// Map JSON keys from deployment artifacts to SDK contract names
const ADDRESS_MAP: Record<string, CONTRACT_NAMES> = {
  Accounting: CONTRACT_NAMES.accounting,
  CSModule: CONTRACT_NAMES.csModule,
  CuratedModule: CONTRACT_NAMES.curatedModule,
  Ejector: CONTRACT_NAMES.ejector,
  ExitPenalties: CONTRACT_NAMES.exitPenalties,
  FeeDistributor: CONTRACT_NAMES.feeDistributor,
  FeeOracle: CONTRACT_NAMES.feeOracle,
  HashConsensus: CONTRACT_NAMES.hashConsensus,
  ParametersRegistry: CONTRACT_NAMES.parametersRegistry,
  ValidatorStrikes: CONTRACT_NAMES.validatorStrikes,
  Verifier: CONTRACT_NAMES.verifier,
  OperatorsData: CONTRACT_NAMES.operatorsData,
  PermissionlessGate: CONTRACT_NAMES.permissionlessGate,
  VettedGate: CONTRACT_NAMES.vettedGate,
};

export const parseDevnetAddresses = (
  json: DevnetJson,
): Partial<Record<CONTRACT_NAMES, Address>> => {
  const result: Partial<Record<CONTRACT_NAMES, Address>> = {};

  for (const [jsonKey, sdkKey] of Object.entries(ADDRESS_MAP)) {
    const value = json[jsonKey];
    if (typeof value === 'string' && value.startsWith('0x')) {
      result[sdkKey] = value as Address;
    }
  }

  // Handle CuratedGates array → curatedGate1..9
  const gates = json.CuratedGates;
  if (Array.isArray(gates)) {
    CURATED_GATES.forEach((contractName, index) => {
      const address = gates[index];
      if (address && isAddress(address)) {
        result[contractName] = address;
      }
    });
  }

  return result;
};

export const overridedAddresses = config.devnetAddresses
  ? parseDevnetAddresses(config.devnetAddresses)
  : undefined;
