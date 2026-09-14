import {
  AddressProof,
  CurveParameters,
  CurveRef,
  NodeOperatorId,
} from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';

export type ClaimIcsFormInputType = {
  curveId: bigint;
};

export type ClaimIcsFormNetworkData = {
  address: Address;
  nodeOperatorId: NodeOperatorId;
  icsPaused: boolean;
  canClaimCurve: boolean;
  currentCurve: CurveRef;
  currentParameters: CurveParameters;
  newCurve: CurveRef;
  newParameters: CurveParameters;
  proof: AddressProof;
  justClaimed?: boolean;
};
