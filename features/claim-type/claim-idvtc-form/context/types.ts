import {
  AddressProof,
  CurveParameters,
  CurveRef,
  NodeOperatorId,
  OPERATOR_TYPE,
} from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';

export type ClaimIdvtcFormInputType = {
  curveId: bigint;
};

export type ClaimIdvtcFormNetworkData = {
  address: Address;
  nodeOperatorId: NodeOperatorId;
  idvtcPaused: boolean;
  canClaimCurve: boolean;
  currentCurve: CurveRef;
  currentOperatorType?: OPERATOR_TYPE;
  isCurrentIcs: boolean;
  currentParameters: CurveParameters;
  newCurve: CurveRef;
  newParameters: CurveParameters;
  proof: AddressProof;
  // Injected by the flow at buildCallback time: the success stage then holds on members init
  willInitMembers?: boolean;
};
