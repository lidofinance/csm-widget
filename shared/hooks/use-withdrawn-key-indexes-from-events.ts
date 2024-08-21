import { useLidoSWR } from '@lido-sdk/react';
import { getCsmConstants } from 'consts/csm-constants';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { WithdrawalSubmittedEvent } from 'generated/CSModule';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import { useAccount, useCSModuleRPC } from 'shared/hooks';
import { getSettledValue } from 'utils';

const restoreEvents = (events: WithdrawalSubmittedEvent[]) =>
  events
    .sort((a, b) => a.blockNumber - b.blockNumber)
    .map((e) => e.args.keyIndex.toNumber());

export const useWithdrawnKeyIndexesFromEvents = () => {
  const contract = useCSModuleRPC();
  const { chainId } = useAccount();
  const nodeOperatorId = useNodeOperatorId();

  const fetcher = useCallback(async () => {
    const filters = [
      contract.filters.WithdrawalSubmitted(nodeOperatorId, null, null),
    ];

    const blockNumber = getCsmConstants(chainId).deploymentBlockNumber;
    const filterResults = await Promise.allSettled(
      filters.map((filter) => contract.queryFilter(filter, blockNumber)),
    );

    const events = filterResults.flatMap(getSettledValue).filter(Boolean);

    return restoreEvents(events as WithdrawalSubmittedEvent[]);
  }, [nodeOperatorId, chainId, contract]);

  return useLidoSWR(
    ['withdrawn-keys', nodeOperatorId, chainId],
    nodeOperatorId ? fetcher : null,
    STRATEGY_LAZY,
  );
};
