import { BigNumber } from 'ethers';
import { type TOKENS } from 'consts/tokens';
import { BondBalance, LoadingRecord, NodeOperatorId } from 'types';

export type AddBondFormDataContextValue = AddBondFormNetworkData;

export type AddBondFormInputType = {
  token: TOKENS;
  amount?: BigNumber;
};

export type AddBondFormNetworkData = {
  nodeOperatorId?: NodeOperatorId;
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  bond?: BondBalance;
  loading: LoadingRecord<
    'etherBalance' | 'stethBalance' | 'wstethBalance' | 'bond'
  >;
  revalidate: () => Promise<void>;
};

export type AddBondFormValidationContext = {
  etherBalance: BigNumber;
};
