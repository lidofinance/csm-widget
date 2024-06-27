import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_EAGER } from 'consts/swr-strategies';
import { NodeOperatorId } from 'types';
import { useCSAccountingRPC } from './useCsmContracts';
import { useMemo } from 'react';

export const useNodeOperatorBalance = (
  nodeOperatorId?: NodeOperatorId,
  config = STRATEGY_EAGER,
) => {
  const { data, ...swr } = useContractSWR({
    contract: useCSAccountingRPC(),
    method: 'getBondSummary',
    params: [nodeOperatorId],
    shouldFetch: !!nodeOperatorId,
    config,
  });

  const [delta, shortage, excess, isShortage] = useMemo(() => {
    const delta = data ? data.current.sub(data.required) : undefined;
    const isShortage = delta?.lt(0) ?? false;
    const shortage = isShortage ? delta?.mul(-1) : undefined;
    const excess = isShortage ? undefined : delta;

    return [delta, shortage, excess, isShortage] as const;
  }, [data]);

  return {
    ...swr,
    data: data
      ? {
          current: data.current,
          required: data.required,
          shortage,
          excess,
          delta,
          isShortage,
        }
      : undefined,
  };
};
