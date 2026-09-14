import {
  BondBalance,
  CurveRef,
  KeyWithStatus,
  NodeOperatorId,
  NodeOperatorInfo,
} from '@lidofinance/lido-csm-sdk';

export type RemoveKeysFormInputType = {
  selection: {
    start: number;
    count: number;
  };
};

export type RemoveKeysFormNetworkData = {
  nodeOperatorId: NodeOperatorId;
  curve: CurveRef;
  keys: KeyWithStatus[];
  info: NodeOperatorInfo;
  bond: BondBalance;
  removalFee: bigint;
};
