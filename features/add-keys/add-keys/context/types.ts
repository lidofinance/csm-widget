import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { BondBalance, DepositData, LoadingRecord, NodeOperatorId } from 'types';

export type AddKeysFormDataContextValue = AddKeysFormNetworkData & {
  bondAmount?: BigNumber;
};

export type AddKeysFormInputType = {
  token: TOKENS;
  rawDepositData?: string;
  depositData: DepositData[];
};

export type AddKeysFormNetworkData = {
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  nodeOperatorId?: NodeOperatorId;
  bond?: BondBalance;
  loading: LoadingRecord<
    'etherBalance' | 'stethBalance' | 'wstethBalance' | 'bond'
  >;
  revalidate: () => Promise<void>;
};

export type AddKeysFormValidationContext = {
  gasCost: BigNumber;
  etherBalance: BigNumber;
};
