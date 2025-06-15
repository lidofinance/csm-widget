import { AddressProof, CurveParameters } from '@lidofinance/lido-csm-sdk';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { LoadingRecord } from 'types';
import { Address } from 'viem';

export type ClaimTypeFormInputType = {
  curveId: bigint;
};

export type ClaimTypeFormNetworkData = {
  address?: Address;
  nodeOperatorId?: NodeOperatorId;
  canClaimCurve?: boolean;
  currentCurveId?: bigint;
  currentParameters?: CurveParameters;
  newCurveId?: bigint;
  newParameters?: CurveParameters;
  proof?: AddressProof;
  loading: LoadingRecord<
    | 'newCurveId'
    | 'newParameters'
    | 'currentCurveId'
    | 'currentParameters'
    | 'proof'
    | 'canClaimCurve'
  >;
};
