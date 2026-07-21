import { FC } from 'react';
import { Button, Text } from '@lidofinance/lido-ui';
import { useSiweAuth } from 'modules/siwe';
import { useDappStatus } from 'modules/web3';
import { Block, Stack } from 'shared/components';
import { Connect } from 'shared/wallet';

const DkgConnect: FC = () => (
  <Block>
    <Stack direction="column" gap="lg">
      <Stack direction="column" gap="md">
        <Text as="h3" size="lg" weight="bold">
          Connect your wallet
        </Text>
        <Text size="xs" color="secondary">
          Connect your wallet and sign a verification message to manage your DKG
          files
        </Text>
      </Stack>
      <Connect size="sm" fullwidth />
    </Stack>
  </Block>
);

const DkgSignIn: FC = () => {
  const { signIn } = useSiweAuth();

  return (
    <Block>
      <Stack direction="column" gap="lg">
        <Text size="xs">
          Sign in to verify your identity and manage your DKG files
        </Text>
        <Button size="sm" onClick={signIn} fullwidth>
          Sign in
        </Button>
      </Stack>
    </Block>
  );
};

export const DkgSignInPage: FC = () => {
  const { isAccountActive } = useDappStatus();

  return <>{isAccountActive ? <DkgSignIn /> : <DkgConnect />}</>;
};
