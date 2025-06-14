import { contractHooksFactory } from '@lido-sdk/react';
import { getCsmContractAddressGetter } from 'consts/csm-constants';
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
  Versioned__factory,
} from 'generated';

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

const CSModuleVersioned = contractHooksFactory(
  Versioned__factory,
  getCsmContractAddressGetter('CSModule'),
);

export const useCSModuleVersionedRPC = CSModuleVersioned.useContractRPC;

const CSAccountingVersioned = contractHooksFactory(
  Versioned__factory,
  getCsmContractAddressGetter('CSAccounting'),
);

export const useCSAccountingVersionedRPC = CSAccountingVersioned.useContractRPC;
