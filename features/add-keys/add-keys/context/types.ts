import {
  BondBalance,
  CurveParameters,
  CurveRef,
  NodeOperatorId,
  NodeOperatorInfo,
  ShareLimitInfo,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import type { FileUploadItemDto } from 'modules/surveys-sdk/generated';
import { DepositDataInputType } from 'shared/hook-form/deposit-data';
import { KeysAvailable } from 'shared/hooks';

export type AddKeysFormInputType = {
  token: TOKENS;
  bondAmount?: bigint;
  dkgFiles: FileUploadItemDto[];
} & DepositDataInputType;

export type AddKeysFormNetworkData = {
  ethBalance: bigint;
  stethBalance: bigint;
  wstethBalance: bigint;
  nodeOperatorId: NodeOperatorId;
  curve: CurveRef;
  operatorInfo: NodeOperatorInfo;
  curveParameters: CurveParameters;
  bond: BondBalance;
  isPaused: boolean;
  maxStakeEth: bigint;
  shareLimit?: ShareLimitInfo;
  keysAvailable?: KeysAvailable;
};
