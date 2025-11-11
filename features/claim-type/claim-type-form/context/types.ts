import { AddressProof, CurveParameters } from '@lidofinance/lido-csm-sdk';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { Address } from 'viem';

export type ClaimTypeFormInputType = {
  curveId: bigint;
};

export type ClaimTypeFormNetworkData = {
  address: Address;
  nodeOperatorId: NodeOperatorId;
  icsPaused: boolean;
  canClaimCurve: boolean;
  currentCurveId: bigint;
  currentParameters: CurveParameters;
  newCurveId: bigint;
  newParameters: CurveParameters;
  proof: AddressProof;
  justClaimed?: boolean;
};
