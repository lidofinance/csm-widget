import { FC } from 'react';

import { Text } from '@lidofinance/lido-ui';
import { Block, Stack } from 'shared/components';
import { Connect } from 'shared/wallet';

export const SiweConnect: FC = () => (
  <Block>
    <Stack direction="column" gap="lg">
      <Stack direction="column" gap="md">
        <Text as="h3" size="lg" weight="bold">
          Connect your wallet
        </Text>
        <Text size="xs" color="secondary">
          Connect your wallet and sign a verification message to continue.
        </Text>
      </Stack>
      <Connect size="sm" fullwidth />
    </Stack>
  </Block>
);
