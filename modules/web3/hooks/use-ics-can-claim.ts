import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useLidoSDK } from '../web3-provider';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export const KEY_ICS_CAN_CLAIM = ['ics-can-claim'];

export const useIcsCanClaim = ({
  address,
  nodeOperatorId,
}: {
  address: Address | undefined;
  nodeOperatorId: NodeOperatorId | undefined;
}) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: [...KEY_ICS_CAN_CLAIM, { address, nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(address);
      invariant(nodeOperatorId !== undefined);
      return csm.icsGate.canClaimCurve(address, nodeOperatorId);
    },
    enabled: !!address && nodeOperatorId !== undefined,
  });
};
