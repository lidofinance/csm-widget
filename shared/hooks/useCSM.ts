import { contractHooksFactory } from '@lido-sdk/react';
import { getCSMContractAddressGetter } from 'consts/csm-contracts';
import { CSAccounting__factory, CSModule__factory } from 'generated';

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
