import { contractHooksFactory } from '@lido-sdk/react';
import { getCSMContractAddressGetter } from 'consts/csm-contracts';
import {
  CSAccounting__factory,
  CSEarlyAdoption__factory,
  CSFeeDistributor__factory,
  CSModule__factory,
} from 'generated';

const CSModule = contractHooksFactory(
  CSModule__factory,
  getCSMContractAddressGetter('CSModule'),
);

export const useCSModuleRPC = CSModule.useContractRPC;
export const useCSModuleWeb3 = CSModule.useContractWeb3;

const CSAccounting = contractHooksFactory(
  CSAccounting__factory,
  getCSMContractAddressGetter('CSAccounting'),
);

export const useCSAccountingRPC = CSAccounting.useContractRPC;

const CSFeeDistributor = contractHooksFactory(
  CSFeeDistributor__factory,
  getCSMContractAddressGetter('CSFeeDistributor'),
);

export const useCSFeeDistributorRPC = CSFeeDistributor.useContractRPC;

const CSEarlyAdoption = contractHooksFactory(
  CSEarlyAdoption__factory,
  getCSMContractAddressGetter('CSEarlyAdoption'),
);

export const useCSEarlyAdoptionRPC = CSEarlyAdoption.useContractRPC;
