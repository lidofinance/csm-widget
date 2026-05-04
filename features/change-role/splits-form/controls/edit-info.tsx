import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { BondRow } from './bond-row';

export const EditInfo: FC = () => {
  return (
    <>
      <Text size="md" weight={700} as="h4">
        Set up addresses to split rewards to
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
        <BondRow />

        <Text size="xxs" color="secondary">
          This share decreases as you allocate shares to the addresses below.
        </Text>
      </Stack>
    </>
  );
};
