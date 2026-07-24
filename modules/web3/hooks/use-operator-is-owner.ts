import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useSmSDK } from '../web3-provider';
import { useDappStatus } from './use-dapp-status';

export const KEY_OPERATOR_IS_OWNER = ['operator-is-owner'];

export const useOperatorIsOwner = (
  nodeOperatorId: NodeOperatorId | undefined,
  customAddress?: Address,
) => {
  const { address: dappAddress } = useDappStatus();
  const address = customAddress ?? dappAddress;
  const { operator } = useSmSDK();

  return useQuery({
    queryKey: [...KEY_OPERATOR_IS_OWNER, { address, nodeOperatorId }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(address);
      invariant(nodeOperatorId !== undefined);
      return operator.isOwner(nodeOperatorId, address);
    },
    enabled: !!address && nodeOperatorId !== undefined,
  });
};
