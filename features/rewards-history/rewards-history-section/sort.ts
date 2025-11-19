import { ValidatorRewardsEntity } from '@lidofinance/lido-csm-sdk';
import { SortCriteria, SortFunctions } from 'providers/table-provider';

const sortByDate: SortCriteria<ValidatorRewardsEntity> = (item) => [
  item.startTimestamp,
  item.indexInReport,
];

const sortByPubkey: SortCriteria<ValidatorRewardsEntity> = (item) => [
  item.pubkey,
  item.validatorIndex,
  item.blockNumber,
];

const sortByFee: SortCriteria<ValidatorRewardsEntity> = (item) => [
  item.fee,
  item.blockNumber,
  item.indexInReport,
];

const sortByPerformance: SortCriteria<ValidatorRewardsEntity> = (item) => [
  item.slashed ? 0 : 1,
  item.performance,
  item.blockNumber,
  item.indexInReport,
];

const sortByThreshold: SortCriteria<ValidatorRewardsEntity> = (item) => [
  item.threshold,
  item.blockNumber,
  item.indexInReport,
];

const sortByRewards: SortCriteria<ValidatorRewardsEntity> = (item) => [
  item.receivedRewards,
  item.blockNumber,
  item.indexInReport,
];

export const sortFunctions: SortFunctions<ValidatorRewardsEntity> = {
  startTimestamp: sortByDate,
  pubkey: sortByPubkey,
  fee: sortByFee,
  performance: sortByPerformance,
  threshold: sortByThreshold,
  receivedRewards: sortByRewards,
};
