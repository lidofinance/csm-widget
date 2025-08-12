import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Stack, Text } from '@lidofinance/lido-ui';
import { Note } from 'shared/components';
import { useApplyFormData } from './context';
import type { ApplyFormInputType } from './context';

export const ApplyFormInfo: FC = () => {
  const { connectedAddress } = useApplyFormData();
  const { watch } = useFormContext<ApplyFormInputType>();
  
  const additionalAddresses = watch('additionalAddresses');
  const socialProof = watch('socialProof');

  const hasTwitter = socialProof?.twitter?.trim();
  const hasDiscord = socialProof?.discord?.trim();
  const additionalCount = additionalAddresses?.length || 0;

  return (
    <Stack direction="column" spacing="md">
      <Note>
        <Stack direction="column" spacing="xs">
          <Text size="xs" weight="bold">
            Application Summary
          </Text>
          <Text size="xs">
            Main address: {connectedAddress ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}` : 'Not connected'}
          </Text>
          <Text size="xs">
            Additional addresses: {additionalCount}/5
          </Text>
          <Text size="xs">
            Social verification: Twitter {hasTwitter ? '✓' : '✗'}, Discord {hasDiscord ? '✓' : '✗'}
          </Text>
        </Stack>
      </Note>
      
      {additionalCount === 0 && !hasTwitter && !hasDiscord && (
        <Note color="warning">
          <Text size="xs">
            Consider adding additional addresses or social accounts to strengthen your application.
          </Text>
        </Note>
      )}
    </Stack>
  );
};