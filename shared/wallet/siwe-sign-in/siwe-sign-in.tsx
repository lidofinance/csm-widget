import { Block, Button, Text } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { useSiweAuth } from 'modules/siwe';
import { useDappStatus } from 'modules/web3';
import { Stack } from 'shared/components';
import { Connect } from '../connect/connect';

// Wallet-not-connected step of a SIWE gate. The description copy varies per
// surface, so it's passed in.
export const SiweConnect: FC<{ description: ReactNode }> = ({
  description,
}) => (
  <Block>
    <Stack direction="column" gap="lg">
      <Stack direction="column" gap="md">
        <Text as="h3" size="lg" weight="bold">
          Connect your wallet
        </Text>
        <Text size="xs" color="secondary">
          {description}
        </Text>
      </Stack>
      <Connect size="sm" fullwidth />
    </Stack>
  </Block>
);

// Connected-but-not-signed step: the surface-specific body plus the Sign in
// button that triggers the SIWE signature.
export const SiweSignIn: FC<PropsWithChildren> = ({ children }) => {
  const { signIn } = useSiweAuth();

  return (
    <Block>
      <Stack direction="column" gap="lg">
        <Text size="xs">{children}</Text>
        <Button size="sm" onClick={signIn} fullwidth>
          Sign in
        </Button>
      </Stack>
    </Block>
  );
};

// Full SIWE gate fallback: Connect when disconnected, else the sign-in body.
export const SiweSignInPage: FC<
  PropsWithChildren<{ connectDescription: ReactNode }>
> = ({ connectDescription, children }) => {
  const { isAccountActive } = useDappStatus();

  return isAccountActive ? (
    <SiweSignIn>{children}</SiweSignIn>
  ) : (
    <SiweConnect description={connectDescription} />
  );
};
