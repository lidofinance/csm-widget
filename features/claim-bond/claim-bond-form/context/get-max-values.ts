import {
  BondBalance,
  convertEthToShares,
  FeeSplit,
  PerToken,
  Rewards,
  StethPoolData,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { MAX_ETH_AMOUNT } from 'consts/tokens';
import { calculateAvailableToClaim } from 'utils';

export type MaxValues = PerToken<[bigint, bigint]>;

type Props = {
  bond?: BondBalance;
  rewards?: Rewards;
  poolData: StethPoolData;
  feeSplits?: FeeSplit[];
};

const limitMaxEth = (value: bigint) =>
  value > MAX_ETH_AMOUNT ? MAX_ETH_AMOUNT : value;

export const getMaxValues = ({
  bond,
  rewards,
  poolData,
  feeSplits,
}: Props): MaxValues => {
  const maxBond = calculateAvailableToClaim({
    bond,
    rewards: undefined,
    feeSplits,
  });
  const maxBondAndRewards = calculateAvailableToClaim({
    bond,
    rewards,
    feeSplits,
  });

  return {
    [TOKENS.eth]: [limitMaxEth(maxBond), limitMaxEth(maxBondAndRewards)],
    [TOKENS.steth]: [maxBond, maxBondAndRewards],
    [TOKENS.wsteth]: [
      convertEthToShares(maxBond, poolData),
      convertEthToShares(maxBondAndRewards, poolData),
    ],
  };
};
