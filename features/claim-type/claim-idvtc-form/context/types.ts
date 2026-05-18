import {
  AddressProof,
  CurveParameters,
  OPERATOR_TYPE,
} from '@lidofinance/lido-csm-sdk';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
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
  currentCurveId: bigint;
  currentOperatorType: OPERATOR_TYPE;
  isCurrentIcs: boolean;
  currentParameters: CurveParameters;
  newCurveId: bigint;
  newParameters: CurveParameters;
  proof: AddressProof;
  justClaimed?: boolean;
};
