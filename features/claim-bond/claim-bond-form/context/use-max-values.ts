import {
  BondBalance,
  PerToken,
  Rewards,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { MAX_ETH_AMOUNT } from 'consts/tokens';
import { useWstethBySteth } from 'modules/web3';
import { useAvailableToClaim } from 'shared/hooks';

const limitMaxEth = (value: bigint) =>
  value > MAX_ETH_AMOUNT ? MAX_ETH_AMOUNT : value;

type Props = {
  bond?: BondBalance;
  rewards?: Rewards;
  lockedBond?: bigint;
};

export type MaxValues = PerToken<[bigint, bigint]>;

export const useMaxValues = ({ bond, rewards }: Props) => {
  const maxBond = useAvailableToClaim({
    bond,
    rewards: undefined,
  });
  const maxBondAndRewards = useAvailableToClaim({
    bond,
    rewards,
  });

  const { data: maxBondWsteth } = useWstethBySteth(maxBond);
  const { data: maxBondAndRewardsWsteth } = useWstethBySteth(maxBondAndRewards);

  return useQuery({
    enabled:
      maxBondWsteth !== undefined && maxBondAndRewardsWsteth !== undefined,
    queryKey: ['use-max-values', { bond, rewards: rewards?.available }],
    queryFn: () =>
      ({
        [TOKENS.eth]: [limitMaxEth(maxBond), limitMaxEth(maxBondAndRewards)],
        [TOKENS.steth]: [maxBond, maxBondAndRewards],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        [TOKENS.wsteth]: [maxBondWsteth!, maxBondAndRewardsWsteth!],
      }) as MaxValues,
  });
};
