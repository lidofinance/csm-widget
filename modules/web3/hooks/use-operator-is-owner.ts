import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useLidoSDK } from '../web3-provider';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

export const KEY_OPERATOR_IS_OWNER = ['operator-is-owner'];

export const useOperatorIsOwner = ({
  address,
  nodeOperatorId,
}: {
  address: Address | undefined;
  nodeOperatorId: NodeOperatorId | undefined;
}) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_IS_OWNER, { address, nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(address);
      invariant(nodeOperatorId !== undefined);
      return csm.operator.isOwner(nodeOperatorId, address);
    },
    enabled: !!address && nodeOperatorId !== undefined,
  });
};
