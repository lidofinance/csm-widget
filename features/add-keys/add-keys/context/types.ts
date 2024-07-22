import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { BondBalance, LoadingRecord, NodeOperatorId } from 'types';

export type AddKeysFormDataContextValue = AddKeysFormNetworkData & {
  bondAmount?: BigNumber;
};

export type AddKeysFormInputType = {
  token: TOKENS;
} & DepositDataInputType;

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
