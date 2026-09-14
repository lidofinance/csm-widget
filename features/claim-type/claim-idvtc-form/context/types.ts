import {
  AddressProof,
  CurveParameters,
  CurveRef,
  NodeOperatorId,
  OPERATOR_TYPE,
} from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';

export type ClaimIdvtcMode = 'upgrade' | 'create';

export type ClaimIdvtcFormInputType = {
  curveId: bigint;
  mode: ClaimIdvtcMode;
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
  justClaimed?: boolean;
  // Injected by the flow at buildCallback time (not fetched by the data
  // provider): tells the tx success stage to hand off to the members-init
  // stage instead of the final success screen.
  willInitMembers?: boolean;
};
