import {
  CurveRef,
  KeyWithStatus,
  NodeOperatorId,
  NodeOperatorInfo,
} from '@lidofinance/lido-csm-sdk';

export type EjectKeysFormInputType = {
  selection: number[];
  feeAmount?: bigint;
};

export type EjectKeysFormNetworkData = {
  nodeOperatorId: NodeOperatorId;
  curve: CurveRef;
  ethBalance: bigint;
  keys: KeyWithStatus[];
  info: NodeOperatorInfo;
  ejectKeyFee: bigint;
};
