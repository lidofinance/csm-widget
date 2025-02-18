import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { BigNumber } from 'ethers';
import { ELRewardsStealingPenaltyReportedEvent } from 'generated/CSModule';
import { useCallback } from 'react';
import { useAccount, useCSAccountingRPC, useMergeSwr } from 'shared/hooks';
import { NodeOperatorId } from 'types';
import useDappnodeUrls from './use-dappnode-urls';
import { fetchWithRetry } from 'dappnode/utils/fetchWithRetry';

const parseEvents = (data: any): ELRewardsStealingPenaltyReportedEvent[] => {
  return data.map((event: any) => ({
    nodeOperatorId: `${parseInt(event.NodeOperatorId)}`,
    proposedBlockHash: event.ProposedBlockHash as string,
    stolenAmount: BigNumber.from(event.StolenAmount),
    blockNumber: parseInt(event.Raw.blockNumber, 16),
  }));
};

const restoreEvents = (
  events: ELRewardsStealingPenaltyReportedEvent[],
): string[] =>
  events
    .map((e) => e.args.nodeOperatorId.toString())
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

const useLockedNodeOperatorsFromAPI = () => {
  const { backendUrl } = useDappnodeUrls();
  const { chainId } = useAccount();

  const fetcher = useCallback(async (): Promise<string[]> => {
    try {
      console.debug('Fetching EL rewards stealing penalties...');
      const url = `${backendUrl}/api/v0/events_indexer/el_rewards_stealing_penalties_reported`;
      const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };

      // Retry logic for 202 status
      const response = await fetchWithRetry(url, options, 5000);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const events = parseEvents(data);

      console.debug('Parsed EL rewards stealing penalties:', events);

      return restoreEvents(events);
    } catch (e) {
      console.error(`Error fetching EL rewards stealing penalties: ${e}`);
      return [];
    }
  }, [backendUrl]);

  return useLidoSWR(
    ['locked-node-operators-ids', chainId],
    fetcher,
    STRATEGY_IMMUTABLE,
  );
};

export type LockedOperator = [NodeOperatorId, BigNumber];

export const useNodeOperatorsWithLockedBond = () => {
  const swrNodeOperators = useLockedNodeOperatorsFromAPI();
  const contract = useCSAccountingRPC();
  const { chainId } = useAccount();

  const nodeOperatorIds = swrNodeOperators.data;

  const fetcher = useCallback(async (): Promise<LockedOperator[]> => {
    if (!nodeOperatorIds) return [];

    const promises = nodeOperatorIds.map(
      async (id) =>
        [id, await contract.getActualLockedBond(id)] as LockedOperator,
    );
    const result = await Promise.all(promises);
    return result.filter((r) => r[1].gt(0));
  }, [contract, nodeOperatorIds]);

  const swrList = useLidoSWR(
    ['locked-node-operators', chainId, nodeOperatorIds],
    nodeOperatorIds && chainId ? fetcher : null,
    STRATEGY_IMMUTABLE,
  );

  return useMergeSwr([swrNodeOperators, swrList], swrList.data);
};
