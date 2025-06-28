import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useLidoSDK } from '../web3-provider';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export const useIcsProof = (address: Address | undefined) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['ics-proof', { address }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(address);
      return csm.icsGate.getProofAndConsumed(address);
    },
    enabled: !!address,
  });
};

export const useIcsCanClaim = ({
  address,
  nodeOperatorId,
}: {
  address: Address | undefined;
  nodeOperatorId: NodeOperatorId | undefined;
}) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['ics-can-claim', { address, nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(address);
      invariant(nodeOperatorId !== undefined);
      return csm.icsGate.canClaimCurve(address, nodeOperatorId);
    },
    enabled: !!address && nodeOperatorId !== undefined,
  });
};

export const useIcsPaused = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['ics-paused'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.icsGate.isPaused(),
  });
};

export const useOperatorIsOwner = ({
  address,
  nodeOperatorId,
}: {
  address: Address | undefined;
  nodeOperatorId: NodeOperatorId | undefined;
}) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['operator-is-owner', { address, nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(address);
      invariant(nodeOperatorId !== undefined);
      return csm.operator.isOwner(nodeOperatorId, address);
    },
    enabled: !!address && nodeOperatorId !== undefined,
  });
};
