import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { KeysAvailable, ShareLimitInfo } from 'shared/hooks';
import { BondBalance, LoadingRecord, NodeOperatorId } from 'types';

// DAPPNODE
export interface KeysFile {
  name: string;
  content: { pubkey: string };
}

export type AddKeysFormInputType = {
  token: TOKENS;
  bondAmount?: BigNumber;
  keystores?: KeysFile[]; //dappnode
  password?: string; //dappnode
} & DepositDataInputType;

export type AddKeysFormNetworkData = {
  etherBalance?: BigNumber;
  stethBalance?: BigNumber;
  wstethBalance?: BigNumber;
  nodeOperatorId?: NodeOperatorId;
  keysUploadLimit?: number;
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
    | 'keysUploadLimit'
    | 'status'
    | 'shareLimit'
    | 'blockNumber'
  >;
};
