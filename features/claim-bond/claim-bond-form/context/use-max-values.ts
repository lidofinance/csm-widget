import { MAX_ETH_AMOUNT, TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import {
  useAvailableToClaim,
  useMergeSwr,
  useWstethBySteth,
} from 'shared/hooks';
import { BondBalance, RewardsBalance } from 'types';

const limitMaxEth = (values: BigNumber[]) =>
  values.map((value) => (value.gt(MAX_ETH_AMOUNT) ? MAX_ETH_AMOUNT : value));

type Props = {
  bond?: BondBalance;
  rewards?: RewardsBalance;
  lockedBond?: BigNumber;
};

export type MaxValues = Record<
  TOKENS,
  [BigNumber | undefined, BigNumber | undefined]
>;

export const useMaxValues = ({ bond, rewards }: Props) => {
  const maxBond = useAvailableToClaim({
    bond,
    rewards: undefined,
  });
  const maxBondAndRewards = useAvailableToClaim({
    bond,
    rewards,
  });

  const bondSwr = useWstethBySteth(maxBond);
  const bondAndRewardsSwr = useWstethBySteth(maxBondAndRewards);

  return useMergeSwr([bondSwr, bondAndRewardsSwr], {
    [TOKENS.ETH]: limitMaxEth([maxBond, maxBondAndRewards]),
    [TOKENS.STETH]: [maxBond, maxBondAndRewards],
    [TOKENS.WSTETH]: [bondSwr.data, bondAndRewardsSwr.data],
  } as MaxValues);
};
