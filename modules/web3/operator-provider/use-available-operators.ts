import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useMemo } from 'react';
import invariant from 'tiny-invariant';
import { useDappStatus } from '../hooks';
import { useLidoSDK } from '../web3-provider';
import { mergeOperators } from './merge-operators';
import { useCachedNodeOperator } from './use-cached-node-operator';

export const KEY_OPERATORS = ['node-operators'];

export const useAvailableOperators = () => {
  const { csm, cm } = useLidoSDK();
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
      // Query both modules independently: a module that isn't deployed on the
      // current chain (or a transient RPC error) must not hide the other
      // module's operators. Only a TOTAL failure surfaces as a query error.
      const [csmResult, cmResult] = await Promise.allSettled([
        csm.discovery.getNodeOperatorsByAddress(address),
        cm.discovery.getNodeOperatorsByAddress(address),
      ]);

      if (csmResult.status === 'rejected' && cmResult.status === 'rejected') {
        throw csmResult.reason;
      }
      if (csmResult.status === 'rejected') {
        console.warn('CSM operator discovery failed', csmResult.reason);
      }
      if (cmResult.status === 'rejected') {
        console.warn('CM operator discovery failed', cmResult.reason);
      }

      const csmOperators =
        csmResult.status === 'fulfilled' ? csmResult.value : [];
      const cmOperators = cmResult.status === 'fulfilled' ? cmResult.value : [];

      return mergeOperators(csmOperators, cmOperators);
    },
    enabled: !!address,
    placeholderData,
  });
};
