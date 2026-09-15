import {
  BondBalance,
  FeeSplit,
  KeyWithStatus,
  Rewards,
} from '@lidofinance/lido-csm-sdk';
import { calculateAvailableToClaim } from './calculate-available-to-claim';
import { selectKeysBreakdown } from './keys-breakdown';

export type OperatorOverviewInput = {
  keys?: KeyWithStatus[];
  bond?: BondBalance;
  rewards?: Rewards;
  feeSplits?: FeeSplit[];
};

export type MyOperatorsSummary = {
  activeValidators: number;
  liveKeys: number;
  activeBalance: bigint;
  availableToClaim: bigint;
  bondBalance: bigint;
  totalIssues: number;
};

export const aggregateOperatorsOverview = (
  items: OperatorOverviewInput[],
): MyOperatorsSummary =>
  items.reduce<MyOperatorsSummary>(
    (acc, { keys, bond, rewards, feeSplits }) => {
      if (keys) {
        const { counts, issuesCount, activeBalance } =
          selectKeysBreakdown(keys);
        acc.activeValidators += counts.active;
        acc.liveKeys +=
          counts.depositable + counts.activationPending + counts.active;
        acc.activeBalance += activeBalance;
        acc.totalIssues += issuesCount;
      }
      if (bond) {
        acc.bondBalance += bond.current;
        acc.availableToClaim += calculateAvailableToClaim({
          bond,
          rewards,
          feeSplits,
        });
      }
      return acc;
    },
    {
      activeValidators: 0,
      liveKeys: 0,
      activeBalance: 0n,
      availableToClaim: 0n,
      bondBalance: 0n,
      totalIssues: 0,
    },
  );
