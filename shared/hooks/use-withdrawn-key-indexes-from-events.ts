import { useLidoSWR } from '@lido-sdk/react';
import { getCsmConstants } from 'consts/csm-constants';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { WithdrawalSubmittedEvent } from 'generated/CSModule';
import { WithdrawalSubmittedEvent as WithdrawalSubmittedOldEvent } from 'generated/CSModuleOld';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import { useAccount, useCSModuleOldRPC, useCSModuleRPC } from 'shared/hooks';
import { getSettledValue } from 'utils';

type Event = WithdrawalSubmittedEvent | WithdrawalSubmittedOldEvent;

const restoreEvents = (events: Event[]) =>
  events
    .sort((a, b) => a.blockNumber - b.blockNumber)
    .map((e) => e.args.keyIndex.toNumber());

export const useWithdrawnKeyIndexesFromEvents = () => {
  const contract = useCSModuleRPC();
  const contractOld = useCSModuleOldRPC();
  const { chainId } = useAccount();
  const nodeOperatorId = useNodeOperatorId();

  const fetcher = useCallback(async () => {
    const blockNumber = getCsmConstants(chainId).deploymentBlockNumber;
    const filterResults: PromiseSettledResult<Event[]>[] =
      await Promise.allSettled([
        contractOld.queryFilter(
          contractOld.filters.WithdrawalSubmitted(nodeOperatorId),
          blockNumber,
        ),
        contract.queryFilter(
          contract.filters.WithdrawalSubmitted(nodeOperatorId),
          blockNumber,
        ),
      ]);

    const events = filterResults.flatMap(getSettledValue).filter(Boolean);

    return restoreEvents(events as any);
  }, [contractOld, contract, chainId, nodeOperatorId]);

  return useLidoSWR(
    ['withdrawn-keys', nodeOperatorId, chainId],
    nodeOperatorId ? fetcher : null,
    STRATEGY_LAZY,
  );
};
