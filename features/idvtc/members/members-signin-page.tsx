import { Button, Text } from '@lidofinance/lido-ui';
import { useSiweAuth } from 'modules/siwe';
import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { Block, Stack } from 'shared/components';
import { Connect } from 'shared/wallet';

const MembersConnect: FC = () => (
  <Block>
    <Stack direction="column" gap="lg">
      <Stack direction="column" gap="md">
        <Text as="h3" size="lg" weight="bold">
          Connect your wallet
        </Text>
        <Text size="xs" color="secondary">
          Connect your wallet and sign a verification message to manage your
          cluster members
        </Text>
      </Stack>
      <Connect size="sm" fullwidth />
    </Stack>
  </Block>
);

const MembersSignIn: FC = () => {
  const { signIn } = useSiweAuth();

  return (
    <Block>
      <Stack direction="column" gap="lg">
        <Text size="xs">
          Sign in to verify your identity and manage your cluster members
        </Text>
        <Button size="sm" onClick={signIn} fullwidth>
          Sign in
        </Button>
      </Stack>
    </Block>
  );
};

export const MembersSignInPage: FC = () => {
  const { isAccountActive } = useDappStatus();

  return <>{isAccountActive ? <MembersSignIn /> : <MembersConnect />}</>;
};
