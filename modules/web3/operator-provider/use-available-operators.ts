import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useMemo } from 'react';
import invariant from 'tiny-invariant';
import { fetchAcrossModules } from '../fetch-across-modules';
import { useDappStatus } from '../hooks';
import { useLidoSDK } from '../web3-provider';
import { useCachedNodeOperator } from './use-cached-node-operator';
import { ModuleNodeOperator } from './types';

export const KEY_OPERATORS = ['node-operators'];

export const useAvailableOperators = () => {
  const { sm } = useLidoSDK();
  const { address } = useDappStatus();

  const { data: cached } = useCachedNodeOperator();
  const placeholderData = useMemo(
    () => (cached ? [cached] : undefined),
    [cached],
  );

  return useQuery({
    queryKey: [...KEY_OPERATORS, { address }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(address);
      return fetchAcrossModules(sm, 'operator discovery', (sdk) =>
        sdk.discovery.getNodeOperatorsByAddress(address),
      ) as Promise<ModuleNodeOperator[]>;
    },
    enabled: !!address,
    placeholderData,
  });
};
