import { ValidatorRewardsEntity } from '@lidofinance/lido-csm-sdk';
import { SortCriteria, SortFunctions } from 'providers/table-provider';

const sortByDate: SortCriteria<ValidatorRewardsEntity> = (item) => [
  item.startTimestamp,
];

const sortByPubkey: SortCriteria<ValidatorRewardsEntity> = (item) => [
  item.pubkey,
  item.validatorIndex,
];

const sortByFee: SortCriteria<ValidatorRewardsEntity> = (item) => [item.fee];

const sortByPerformance: SortCriteria<ValidatorRewardsEntity> = (item) => [
  item.slashed ? 0 : 1,
  item.performance,
];

const sortByThreshold: SortCriteria<ValidatorRewardsEntity> = (item) => [
  item.threshold,
];

const sortByRewards: SortCriteria<ValidatorRewardsEntity> = (item) => [
  item.receivedRewards,
];

export const sortFunctions: SortFunctions<ValidatorRewardsEntity> = {
  startTimestamp: sortByDate,
  pubkey: sortByPubkey,
  fee: sortByFee,
  performance: sortByPerformance,
  threshold: sortByThreshold,
  receivedRewards: sortByRewards,
};
