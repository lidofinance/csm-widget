import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT, deployedModules } from 'consts';
import { useMemo } from 'react';
import invariant from 'tiny-invariant';
import { useDappStatus } from '../hooks';
import { useLidoSDK } from '../web3-provider';
import { mergeOperators } from './merge-operators';
import { useCachedNodeOperator } from './use-cached-node-operator';

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
      // Queried per module so one module's RPC failure cannot hide the others'
      // operators; only a total failure surfaces as a query error.
      const entries = deployedModules.flatMap((module) => {
        const sdk = sm[module];
        return sdk ? [{ module, sdk }] : [];
      });
      const settled = await Promise.allSettled(
        entries.map(({ sdk }) =>
          sdk.discovery.getNodeOperatorsByAddress(address),
        ),
      );

      if (settled.every((result) => result.status === 'rejected')) {
        throw settled[0].reason;
      }

      const results = entries.map(({ module }, index) => {
        const result = settled[index];
        if (result.status === 'rejected') {
          console.warn(`${module} operator discovery failed`, result.reason);
          return { module, operators: [] };
        }
        return { module, operators: result.value };
      });

      return mergeOperators(results);
    },
    enabled: !!address,
    placeholderData,
  });
};
