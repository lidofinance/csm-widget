import { FeeSplit } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { Stack } from 'shared/components';
import { SplitsFormInputType, useSplitsFormData } from '../context';
import { useRewardsAddressShare } from '../hooks/use-rewards-address-share';
import { SplitRowView } from './split-row-view';

export const RewardsAddressView: FC = () => {
  const { rewardsAddress } = useSplitsFormData(true);

  const watchedSplits = useWatch<SplitsFormInputType>({
    name: 'feeSplits',
  }) as FeeSplit[];

  const share = useRewardsAddressShare(watchedSplits);

  return (
    <>
      <Text size="md" weight={700} as="h4">
        Set up rewards splitter addresses
      </Text>

      <ul>
        <li>Split rewards across up to 10 additional addresses.</li>
        <li>Additional addresses receive rewards in stETH only.</li>
        <li>
          Claiming is permissionless: anyone can execute the claim, but rewards
          go only to the configured addresses.
        </li>
      </ul>

      <Stack direction="column" gap="sm">
        <Text size="xs" weight={700}>
          Rewards Address
        </Text>
        <SplitRowView
          title="Rewards Address"
          address={rewardsAddress}
          share={share}
          locked
        />

        <Text size="xxs" color="secondary">
          This share decreases as you allocate shares to the addresses below.
        </Text>
      </Stack>
    </>
  );
};
