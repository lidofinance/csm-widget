import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import {
  useAvailableToClaim,
  useMergeSwr,
  useWstethBySteth,
} from 'shared/hooks';
import { BondBalance, RewardsBalance } from 'types';

type Props = {
  bond?: BondBalance;
  rewards?: RewardsBalance;
  lockedBond?: BigNumber;
};

export type MaxValues = Record<
  TOKENS,
  [BigNumber | undefined, BigNumber | undefined]
>;

export const useMaxValues = ({ bond, rewards, lockedBond }: Props) => {
  const maxBond = useAvailableToClaim({
    bond,
    rewards: undefined,
    lockedBond,
  });
  const maxBondAndRewards = useAvailableToClaim({
    bond,
    rewards,
    lockedBond,
  });

  const bondSwr = useWstethBySteth(maxBond);
  const bondAndRewardsSwr = useWstethBySteth(maxBondAndRewards);

  return useMergeSwr([bondSwr, bondAndRewardsSwr], {
    [TOKENS.ETH]: [maxBond, maxBondAndRewards],
    [TOKENS.STETH]: [maxBond, maxBondAndRewards],
    [TOKENS.WSTETH]: [bondSwr.data, bondAndRewardsSwr.data],
  } as MaxValues);
};
