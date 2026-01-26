import { Block, Button, Text } from '@lidofinance/lido-ui';
import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { InputAddress, Stack } from 'shared/components';
import { useSiweAuth } from 'shared/siwe';

export const SiweSignIn: FC = () => {
  const { address } = useDappStatus();
  const { signIn } = useSiweAuth();

  return (
    <Block data-testid="signInForm">
      <Stack direction="column" gap="lg">
        <Stack direction="column" gap="md">
          <Text as="h3" size="lg" weight="bold">
            Sign in
          </Text>
          <Text size="xs" color="secondary">
            To continue, please sign a message with your connected address to
            prove ownership.
          </Text>
        </Stack>
        <Stack direction="column" gap="md">
          <Text size="xs" color="secondary">
            You are requesting ICS operator type for the following address:
          </Text>
          <InputAddress
            disabled
            label="Main address"
            value={address}
            fullwidth
            name="mainAddress"
          />
        </Stack>

        <Button size="sm" onClick={signIn} fullwidth>
          Sign in
        </Button>
      </Stack>
    </Block>
  );
};
