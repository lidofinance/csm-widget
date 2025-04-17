import { Zero } from '@ethersproject/constants';
import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { BigNumber } from 'ethers';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useMemo } from 'react';
import { HexString } from 'shared/keys';
import { standardFetcher } from 'utils';
import { useCsmConstants } from './use-csm-constants';
import { useCSFeeDistributorRPC, useCSFeeOracleRPC } from './useCsmContracts';
import { useMergeSwr } from './useMergeSwr';

export type RewardsReport = {
  blockstamp: {
    block_hash: HexString;
    block_number: number;
    block_timestamp: number;
    ref_epoch: number;
    ref_slot: number;
    slot_number: number;
    state_root: HexString;
  };
  distributable: number;
  frame: [number, number];
  threshold: number;
  operators: Record<
    `${number}`,
    {
      distributed: number;
      stuck: boolean;
      validators: Record<
        `${number}`,
        {
          perf: {
            assigned: number;
            included: number;
          };
          slashed: boolean;
        }
      >;
    }
  >;
};

export const useLastRewardsReport = (config = STRATEGY_CONSTANT) => {
  const feeDistributor = useCSFeeDistributorRPC();

  return useLidoSWR(
    ['fee-oracle-report-e'],
    async () => {
      const logCid = await feeDistributor.logCid();
      if (!logCid) {
        return null;
      }

      const ipfsUrl = `https://ipfs.io/ipfs/${logCid}`;

      return standardFetcher<RewardsReport>(ipfsUrl, {
        headers: {},
      });
    },
    config,
  );
};

export const useLastOperatorRewards = () => {
  const nodeOperatorId = useNodeOperatorId();
  const swrRewards = useLastRewardsReport();

  return useMergeSwr(
    [swrRewards],
    useMemo(() => {
      if (!nodeOperatorId || !swrRewards.data) return undefined;

      const threshold = swrRewards.data.threshold;
      const operator = swrRewards.data.operators[nodeOperatorId];

      if (!operator)
        return {
          distributed: Zero,
          stuck: false,
          validatorsCount: 0,
          validatorsOverThresholdCount: 0,
          threshold,
        };

      const validators = Object.values(operator.validators);

      const overThreshold = validators.filter(
        ({ perf, slashed }) =>
          !slashed &&
          perf.assigned &&
          perf.included / perf.assigned >= threshold,
      );

      return {
        distributed: BigNumber.from(operator.distributed.toString()),
        stuck: operator.stuck,
        validatorsCount: validators.length,
        validatorsOverThresholdCount: overThreshold.length,
        threshold,
      };
    }, [nodeOperatorId, swrRewards.data]),
  );
};

export const useLastRewrdsTx = (config = STRATEGY_CONSTANT) => {
  const feeOracle = useCSFeeOracleRPC();
  const { deploymentBlockNumber } = useCsmConstants();

  return useLidoSWR(
    ['fee-oracle-report-tx'],
    async () => {
      const events = await feeOracle.queryFilter(
        feeOracle.filters.ProcessingStarted(),
        deploymentBlockNumber,
      );
      const txs = events
        .sort((a, b) => a.blockNumber - b.blockNumber)
        .map((event) => {
          return event.transactionHash;
        });
      return txs[txs.length - 1];
    },
    config,
  );
};
