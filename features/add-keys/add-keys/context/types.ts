import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { BondBalance, LoadingRecord, NodeOperatorId } from 'types';

export type AddKeysFormDataContextValue = AddKeysFormNetworkData;

export type AddKeysFormInputType = {
  token: TOKENS;
  bondAmount?: BigNumber;
} & DepositDataInputType;

export type AddKeysFormNetworkData = {
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  nodeOperatorId?: NodeOperatorId;
  bond?: BondBalance;
  maxStakeEther?: BigNumber | null;
  loading: LoadingRecord<
    'etherBalance' | 'stethBalance' | 'wstethBalance' | 'bond' | 'maxStakeEther'
  >;
  revalidate: () => Promise<void>;
};
