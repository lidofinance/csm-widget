import { Button, Card, Description, H3 } from '@lidofinance/lido-app-ui';
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
  <Card>
    <Stack direction="column" gap="lg" selfAlign="stretch">
      <Stack direction="column" gap="md">
        <H3>Connect your wallet</H3>
        <Description color="secondary">{description}</Description>
      </Stack>
      <Connect size="small" fullWidth />
    </Stack>
  </Card>
);

// Connected-but-not-signed step: the surface-specific body plus the Sign in
// button that triggers the SIWE signature.
export const SiweSignIn: FC<PropsWithChildren> = ({ children }) => {
  const { signIn } = useSiweAuth();

  return (
    <Card>
      <Stack direction="column" gap="lg" selfAlign="stretch">
        <Stack direction="column" gap="md">
          <H3>Sign in</H3>
          <Description color="secondary">{children}</Description>
        </Stack>
        <Button
          size="small"
          fullWidth
          onClick={signIn}
          data-testid="siweSignInButton"
        >
          Sign in
        </Button>
      </Stack>
    </Card>
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
