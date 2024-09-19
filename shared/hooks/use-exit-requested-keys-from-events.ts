import { useLidoSWR } from '@lido-sdk/react';
import { getCsmConstants } from 'consts/csm-constants';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { ValidatorExitRequestEvent } from 'generated/ExitBusOracle';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import { useAccount, useExitBusOracleRPC } from 'shared/hooks';
import { getSettledValue } from 'utils';

const restoreEvents = (events: ValidatorExitRequestEvent[]) =>
  events
    .sort((a, b) => a.blockNumber - b.blockNumber)
    .map((e) => e.args.validatorPubkey.toLowerCase());

export const useExitRequestedKeysFromEvents = () => {
  const contract = useExitBusOracleRPC();
  const { chainId } = useAccount();
  const nodeOperatorId = useNodeOperatorId();

  const fetcher = useCallback(async () => {
    const { stakingModuleId } = getCsmConstants(chainId);

    const filters = [
      contract.filters.ValidatorExitRequest(stakingModuleId, nodeOperatorId),
    ];

    const blockNumber = getCsmConstants(chainId).deploymentBlockNumber;
    const filterResults = await Promise.allSettled(
      filters.map((filter) => contract.queryFilter(filter, blockNumber)),
    );

    const events = filterResults.flatMap(getSettledValue).filter(Boolean);

    return restoreEvents(events as ValidatorExitRequestEvent[]);
  }, [nodeOperatorId, chainId, contract]);

  return useLidoSWR(
    ['exit-requested-keys', nodeOperatorId, chainId],
    nodeOperatorId ? fetcher : null,
    STRATEGY_LAZY,
  );
};
