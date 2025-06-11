import { AddressProof } from '@lidofinance/lido-csm-sdk';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk/common';
import { LoadingRecord } from 'types';
import { Address } from 'viem';

export type ClaimTypeFormInputType = {
  curveId: bigint;
};

export type ClaimTypeFormNetworkData = {
  address?: Address;
  nodeOperatorId?: NodeOperatorId;
  canClaimCurve?: boolean;
  curveId?: bigint;
  currentCurveId?: bigint;
  proof?: AddressProof;
  loading: LoadingRecord<
    'proof' | 'curveId' | 'currentCurveId' | 'canClaimCurve'
  >;
};
