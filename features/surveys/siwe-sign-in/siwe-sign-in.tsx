import { Block, Button, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { MatomoLink, Stack } from 'shared/components';
import { useSiweAuth } from 'shared/siwe';

export const SiweSignIn: FC = () => {
  const { signIn } = useSiweAuth();

  return (
    <Block>
      <Stack direction="column" gap="lg">
        <Text size="xs">
          Here you can voluntarily provide information about your Node Operator,
          including your contact details, experience, and setup. This
          information may be used for report building (
          <MatomoLink href="https://app.hex.tech/8dedcd99-17f4-49d8-944e-4857a355b90a/app/3f7d6967-3ef6-4e69-8f7b-d02d903f045b/latest">
            VaNOM
          </MatomoLink>
          ), UI/UX improvements, or feedback purposes. To view or submit this
          information, you must sign in to verify that you are the owner of the
          Reward or Manager address.
        </Text>
        <Button size="sm" onClick={signIn} fullwidth>
          Sign in
        </Button>
      </Stack>
    </Block>
  );
};
