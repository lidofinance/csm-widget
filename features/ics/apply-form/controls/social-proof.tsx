import { FC } from 'react';
import { Text, Stack } from '@lidofinance/lido-ui';
import { TextInputHookForm } from 'shared/hook-form/controls';

export const SocialProof: FC = () => {
  return (
    <Stack direction="column" spacing="md">
      <Stack direction="column" spacing="xs">
        <Text size="sm" weight="bold">
          Social Account Verification
        </Text>
        <Text size="xs" color="secondary">
          You can add your social accounts. To prove you own an account, post a
          message. For more info see the guide.
        </Text>
      </Stack>

      <TextInputHookForm
        fieldName="socialProof.twitter"
        label="Twitter Post Link"
        placeholder="https://twitter.com/username/status/..."
      />

      <TextInputHookForm
        fieldName="socialProof.discord"
        label="Discord Post Link"
        placeholder="https://discord.com/channels/..."
      />
    </Stack>
  );
};