import {
  BondBalance,
  CurveParameters,
  NodeOperatorId,
  NodeOperatorInfo,
  ShareLimitInfo,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { DepositDataInputType } from 'shared/hook-form/deposit-data';
import { KeysAvailable } from 'shared/hooks';

export type AddKeysFormInputType = {
  token: TOKENS;
  bondAmount?: bigint;
} & DepositDataInputType;

export type AddKeysFormNetworkData = {
  ethBalance: bigint;
  stethBalance: bigint;
  wstethBalance: bigint;
  nodeOperatorId: NodeOperatorId;
  curveId: bigint;
  operatorInfo: NodeOperatorInfo;
  curveParameters: CurveParameters;
  bond: BondBalance;
  isPaused: boolean;
  maxStakeEth: bigint;
  shareLimit?: ShareLimitInfo;
  keysAvailable?: KeysAvailable;
};
