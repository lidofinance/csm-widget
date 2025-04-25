import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { KeysAvailable, ShareLimitInfo } from 'shared/hooks';
import { BondBalance, LoadingRecord, NodeOperatorId } from 'types';

export type AddKeysFormInputType = {
  token: TOKENS;
  bondAmount?: BigNumber;
} & DepositDataInputType;

export type AddKeysFormNetworkData = {
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  nodeOperatorId?: NodeOperatorId;
  keysAvailable?: KeysAvailable;
  bond?: BondBalance;
  isPaused?: boolean;
  maxStakeEther?: BigNumber | null;
  shareLimit?: ShareLimitInfo;
  blockNumber?: number;
  loading: LoadingRecord<
    | 'etherBalance'
    | 'stethBalance'
    | 'wstethBalance'
    | 'bond'
    | 'maxStakeEther'
    | 'status'
    | 'shareLimit'
    | 'blockNumber'
  >;
};
