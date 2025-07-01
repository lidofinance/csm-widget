import { Address } from 'viem';
import DEVNET from '../../../../community-staking-module/artifacts/latest/upgrade-hoodi.json';

export const overridedAddresses = {
  csAccounting: DEVNET.CSAccounting as Address,
  csModule: DEVNET.CSModule as Address,
  csFeeDistributor: DEVNET.CSFeeDistributor as Address,
  csFeeOracle: DEVNET.CSFeeOracle as Address,
  csExitPenalties: DEVNET.CSExitPenalties as Address,
  hashConsensus: DEVNET.HashConsensus as Address,
  csEjector: DEVNET.CSEjector as Address,
  csParametersRegistry: DEVNET.CSParametersRegistry as Address,
  csStrikes: DEVNET.CSStrikes as Address,
  permissionlessGate: DEVNET.PermissionlessGate as Address,
  vettedGate: DEVNET.VettedGate as Address,
} as const;
