import { useLidoSWR } from '@lido-sdk/react';
import { getCsmConstants } from 'consts/csm-constants';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { BigNumber } from 'ethers';
import { ELRewardsStealingPenaltyReportedEvent } from 'generated/CSModule';
import { useCallback, useEffect, useState } from 'react';
import {
  useAccount,
  useCSAccountingRPC,
  useCSModuleRPC,
  useCurrentStaticRpcProvider,
  useMergeSwr,
} from 'shared/hooks';
import { NodeOperatorId } from 'types';
import { getSettledValue } from 'utils';

const BLOCKS_PER_MIN = 5; // every 12 sec

const useMinsAgoBlockNumber = (min: number) => {
  const [result, setResult] = useState<number>();

  const staticRpcProvider = useCurrentStaticRpcProvider();

  useEffect(() => {
    let active = true;

    const load = async () => {
      setResult(undefined);
      const currentBlockNumber = await staticRpcProvider.getBlockNumber();
      if (!active) {
        return;
      }
      const blockNumber = currentBlockNumber - min * BLOCKS_PER_MIN;
      setResult(blockNumber);
    };
    void load();

    return () => {
      active = false;
    };
  }, [min, staticRpcProvider]);

  return result;
};

const restoreEvents = (events: ELRewardsStealingPenaltyReportedEvent[]) =>
  events
    .map((e) => e.args.nodeOperatorId.toString())
    .filter((value, index, array) => array.indexOf(value) === index)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

const useLockedNodeOperatorsFromEvents = () => {
  const contract = useCSModuleRPC();
  const { chainId } = useAccount();

  const blockNumber = useMinsAgoBlockNumber(
    getCsmConstants(chainId).retentionPeriodMins,
  );

  // TODO: use BondLockChanged events starting from max retention period
  const fetcher = useCallback(async () => {
    const filters = [
      contract.filters.ELRewardsStealingPenaltyReported(null, null, null),
    ];

    const filterResults = await Promise.allSettled(
      filters.map((filter) => contract.queryFilter(filter, blockNumber)),
    );

    const events = filterResults.flatMap(getSettledValue).filter(Boolean);

    return restoreEvents(events as ELRewardsStealingPenaltyReportedEvent[]);
  }, [blockNumber, contract]);

  return useLidoSWR(
    ['locked-node-operators-ids', blockNumber, chainId],
    fetcher,
    STRATEGY_IMMUTABLE,
  );
};

export type LockedOperator = [NodeOperatorId, BigNumber];

export const useNodeOperatorsWithLockedBond = () => {
  const swrNodeOperators = useLockedNodeOperatorsFromEvents();
  const contract = useCSAccountingRPC();
  const { chainId } = useAccount();

  const nodeOperatorIds = swrNodeOperators.data;

  const fetcher = useCallback(async () => {
    const promises =
      nodeOperatorIds?.map(
        async (id) =>
          [id, await contract.getActualLockedBond(id)] as LockedOperator,
      ) || [];
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
