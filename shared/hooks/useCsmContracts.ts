import { contractHooksFactory } from '@lido-sdk/react';
import { CHAINS, CsmContract, getCsmContractAddress } from 'consts';
import {
  CSAccounting__factory,
  CSEarlyAdoption__factory,
  CSFeeDistributor__factory,
  CSFeeOracle__factory,
  CSModule__factory,
  CSModuleOld__factory,
  ExitBusOracle__factory,
  HashConsensus__factory,
  StakingRouter__factory,
} from 'generated';

// TODO: remove this file after migrate to wagmi

export const getCsmContractAddressGetter =
  (contract: CsmContract) =>
  (chainId: number): string =>
    getCsmContractAddress(chainId as CHAINS, contract);

const CSModule = contractHooksFactory(
  CSModule__factory,
  getCsmContractAddressGetter('CSModule'),
);

export const useCSModuleRPC = CSModule.useContractRPC;
export const useCSModuleWeb3 = CSModule.useContractWeb3;

// TODO: drop after removing Holesky
const CSModuleOld = contractHooksFactory(
  CSModuleOld__factory,
  getCsmContractAddressGetter('CSModule'),
);

export const useCSModuleOldRPC = CSModuleOld.useContractRPC;

const CSAccounting = contractHooksFactory(
  CSAccounting__factory,
  getCsmContractAddressGetter('CSAccounting'),
);

export const useCSAccountingRPC = CSAccounting.useContractRPC;
export const useCSAccountingWeb3 = CSAccounting.useContractWeb3;

const CSFeeDistributor = contractHooksFactory(
  CSFeeDistributor__factory,
  getCsmContractAddressGetter('CSFeeDistributor'),
);

export const useCSFeeDistributorRPC = CSFeeDistributor.useContractRPC;

const CSFeeOracle = contractHooksFactory(
  CSFeeOracle__factory,
  getCsmContractAddressGetter('CSFeeOracle'),
);

export const useCSFeeOracleRPC = CSFeeOracle.useContractRPC;

const HashConsesus = contractHooksFactory(
  HashConsensus__factory,
  getCsmContractAddressGetter('HashConsensus'),
);

export const useHashConsesusRPC = HashConsesus.useContractRPC;

const CSEarlyAdoption = contractHooksFactory(
  CSEarlyAdoption__factory,
  getCsmContractAddressGetter('CSEarlyAdoption'),
);

export const useCSEarlyAdoptionRPC = CSEarlyAdoption.useContractRPC;

const ExitBusOracle = contractHooksFactory(
  ExitBusOracle__factory,
  getCsmContractAddressGetter('ExitBusOracle'),
);

export const useExitBusOracleRPC = ExitBusOracle.useContractRPC;

const StakingRouter = contractHooksFactory(
  StakingRouter__factory,
  getCsmContractAddressGetter('StakingRouter'),
);

export const useStakingRouterRPC = StakingRouter.useContractRPC;
