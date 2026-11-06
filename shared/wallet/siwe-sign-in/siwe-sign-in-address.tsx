import { Button, Card, Description, H3 } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useDappStatus } from 'modules/web3';
import { useSiweAuth } from 'modules/siwe';
import { InputAddress, Stack } from 'shared/components';

// Sign-in step that also confirms the connected address as the operator's main
// address, used by the ICS / IDVTC apply flows.
export const SiweSignInAddress: FC<{ operatorType: string }> = ({
  operatorType,
}) => {
  const { address } = useDappStatus();
  const { signIn } = useSiweAuth();

  return (
    <Card data-testid="signInForm">
      <Stack direction="column" gap="lg">
        <Stack direction="column" gap="md">
          <H3>Sign in</H3>
          <Description color="secondary">
            To continue, please sign a message with your connected address to
            prove ownership.
          </Description>
        </Stack>
        <Stack direction="column" gap="md">
          <Description color="secondary">
            You are requesting {operatorType} operator type for the following
            address:
          </Description>
          <InputAddress
            disabled
            label="Main address"
            value={address}
            fullwidth
            name="mainAddress"
          />
        </Stack>

        <Button size="small" onClick={signIn} fullWidth>
          Sign in
        </Button>
      </Stack>
    </Card>
  );
};
