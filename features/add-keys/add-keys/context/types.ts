import { type TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { DepositDataInputType } from 'shared/hook-form/form-controller';
import { KeysAvailable } from 'shared/hooks';
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
  keysUploadLimit?: number;
  keysAvailable?: KeysAvailable;
  bond?: BondBalance;
  maxStakeEther?: BigNumber | null;
  loading: LoadingRecord<
    | 'etherBalance'
    | 'stethBalance'
    | 'wstethBalance'
    | 'bond'
    | 'maxStakeEther'
    | 'keysUploadLimit'
  >;
};
