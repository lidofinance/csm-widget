import { Block, Button, Text } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';
import { InputAddress, Stack } from 'shared/components';
import { useAuth } from '../shared';
import { useAccount } from 'shared/hooks';

export const SiweSignIn: FC = () => {
  const { address } = useAccount();
  const { signIn } = useAuth();

  const login = useCallback(() => {
    void signIn();
  }, [signIn]);

  return (
    <Block>
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
          />
        </Stack>

        <Button size="sm" onClick={login} fullwidth>
          Sign in
        </Button>
      </Stack>
    </Block>
  );
};
