import DEVNET from '../../../../community-staking-module/artifacts/latest/upgrade-hoodi.json';

export const overridedAddresses = {
  csAccounting: DEVNET.CSAccounting,
  csModule: DEVNET.CSModule,
  csFeeDistributor: DEVNET.CSFeeDistributor,
  csFeeOracle: DEVNET.CSFeeOracle,
  csExitPenalties: DEVNET.CSExitPenalties,
  hashConsensus: DEVNET.HashConsensus,
  csEjector: DEVNET.CSEjector,
  csParametersRegistry: DEVNET.CSParametersRegistry,
  csStrikes: DEVNET.CSStrikes,
  permissionlessGate: DEVNET.PermissionlessGate,
  vettedGate: DEVNET.VettedGate,
} as const;
