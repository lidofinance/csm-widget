import {
  Button,
  Body,
  Card,
  H3,
  Identicon,
  Input,
  Stack,
} from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useDappStatus } from 'modules/web3';
import { useSiweAuth } from 'modules/siwe';

// Sign-in step that also confirms the connected address as the operator's main
// address, used by the ICS / IDVTC apply flows.
export const SiweSignInAddress: FC<{ operatorType: string }> = ({
  operatorType,
}) => {
  const { address } = useDappStatus();
  const { signIn } = useSiweAuth();

  return (
    <Card data-testid="signInForm">
      <Stack direction="column" gap={20} align="stretch">
        <Stack direction="column" gap={8}>
          <H3>Sign in</H3>
          <Body color="secondary">
            To continue, please sign a message with your connected address to
            prove ownership.
            <br />
            You are requesting {operatorType} operator type for the following
            address:
          </Body>
        </Stack>
        <Input
          disabled
          label="Main address"
          value={address}
          name="mainAddress"
          icon={<Identicon address={address} size={20} />}
        />

        <Button onClick={signIn} fullWidth>
          Sign in
        </Button>
      </Stack>
    </Card>
  );
};
