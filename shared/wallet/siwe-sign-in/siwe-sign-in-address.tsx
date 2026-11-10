import {
  Button,
  Card,
  Description,
  H3,
  Identicon,
  Input,
} from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useDappStatus } from 'modules/web3';
import { useSiweAuth } from 'modules/siwe';
import { Stack } from 'shared/components';

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
            <br />
            You are requesting {operatorType} operator type for the following
            address:
          </Description>
        </Stack>
        <Input
          disabled
          label="Main address"
          value={address}
          name="mainAddress"
          icon={<Identicon address={address} size={20} />}
        />

        <Button size="small" onClick={signIn} fullWidth>
          Sign in
        </Button>
      </Stack>
    </Card>
  );
};
