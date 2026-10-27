import { Address, isAddress } from 'viem';

import {
  CONTRACT_NAMES,
  CURATED_GATES,
  MODULE_NAME,
  OverridedAddresses,
} from '@lidofinance/lido-csm-sdk';
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
  MetaRegistry: CONTRACT_NAMES.metaRegistry,
  PermissionlessGate: CONTRACT_NAMES.permissionlessGate,
  VettedGate: CONTRACT_NAMES.icsGate,
  IdentifiedDVTClusterGate: CONTRACT_NAMES.idvtcGate,
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

const moduleOfArtifacts = (json: DevnetJson): MODULE_NAME | undefined =>
  'CuratedModule' in json
    ? MODULE_NAME.CM
    : 'CSModule' in json
      ? MODULE_NAME.CSM
      : undefined;

const isModuleName = (value: string): value is MODULE_NAME =>
  (Object.values(MODULE_NAME) as string[]).includes(value);

// CSM and CSM_02 artifacts both contain CSModule, so detection can't tell them apart
const resolveModule = (
  prefix: string | null,
  artifacts: DevnetJson,
): MODULE_NAME | undefined => {
  if (prefix === null) return moduleOfArtifacts(artifacts);
  return isModuleName(prefix) ? prefix : undefined;
};

const buildDevnetOverridedAddresses = (): OverridedAddresses | undefined => {
  const result: OverridedAddresses = {};

  for (const { module: prefix, artifacts } of config.devnetArtifacts ?? []) {
    const moduleName = resolveModule(prefix, artifacts);
    if (!moduleName) {
      console.warn(
        `Devnet addresses: no module for ${prefix ?? 'unprefixed'} entry, add a valid MODULE= prefix, skipped`,
      );
      continue;
    }
    if (result[moduleName]) {
      console.warn(
        `Devnet addresses: duplicate ${moduleName} entry, last one wins`,
      );
    }
    result[moduleName] = parseDevnetAddresses(artifacts);
  }

  return Object.keys(result).length > 0 ? result : undefined;
};

export const devnetOverridedAddresses: OverridedAddresses | undefined =
  buildDevnetOverridedAddresses();
