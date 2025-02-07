import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useCSFeeDistributorRPC, useCSFeeOracleRPC } from './useCsmContracts';
import { getCsmConstants } from 'consts/csm-constants';
import { standardFetcher } from 'utils';
import { HexString } from 'shared/keys';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useMergeSwr } from './useMergeSwr';
import { useMemo } from 'react';
import { BigNumber } from 'ethers';

const SECONDS_PER_SLOT = 12;

const getRewardsFrameDuration = () => {
  const { slotsPerFrame } = getCsmConstants();
  return slotsPerFrame * SECONDS_PER_SLOT;
};

export const getNextRewardsFrame = (timestamp: number) =>
  timestamp + getRewardsFrameDuration();

export const getPrevRewardsFrame = (timestamp: number) =>
  timestamp - getRewardsFrameDuration();

export const useLastRewardsSlot = (config = STRATEGY_CONSTANT) => {
  const feeOracle = useCSFeeOracleRPC();

  return useLidoSWR(
    ['fee-oracle-slot'],
    async () => {
      const [refSlot, genesisTime] = await Promise.all([
        feeOracle.getLastProcessingRefSlot(),
        feeOracle.GENESIS_TIME(),
      ]);

      if (!refSlot || !genesisTime) {
        return null;
      }

      const timestamp = genesisTime
        .add(refSlot.mul(SECONDS_PER_SLOT))
        .toNumber();

      return { refSlot, timestamp };
    },
    config,
  );
};

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

// TODO: check blocks in between report started and submitted (21644846, 21644860)
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

      if (!operator) return null;

      const validators = Object.values(operator.validators);

      const overTreshold = validators.filter(
        ({ perf, slashed }) =>
          !slashed &&
          perf.assigned &&
          perf.included / perf.assigned >= threshold,
      );

      return {
        distributed: BigNumber.from(operator.distributed.toString()),
        stuck: operator.stuck,
        validatorsCount: validators.length,
        validatorsOverTresholdCount: overTreshold.length,
        threshold,
      };
    }, [nodeOperatorId, swrRewards.data]),
  );
};

export const useLastRewrdsTx = (config = STRATEGY_CONSTANT) => {
  const feeOracle = useCSFeeOracleRPC();
  const { deploymentBlockNumber } = getCsmConstants();

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
