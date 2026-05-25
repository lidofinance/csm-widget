import { Block, Text } from '@lidofinance/lido-ui';
import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { NoSSRWrapper, Stack, WhenLoaded } from 'shared/components';
import { useSiweAuth } from 'shared/siwe';
import { Connect } from 'shared/wallet';
import { ApplyForm } from './apply-form';
import { FormStatus } from './form-status/form-status';
import { DvtProviders, useDvtState } from './shared';
import { SiweSignIn } from './siwe-sign-in/siwe-sign-in';

const DvtApplyContent: FC = () => {
  const { isAccountActive } = useDappStatus();
  const { token } = useSiweAuth();
  const { data, isPending, applyMode, reset } = useDvtState();

  if (!isAccountActive) {
    return (
      <Block>
        <Stack direction="column" gap="lg">
          <Stack direction="column" gap="md">
            <Text as="h3" size="lg" weight="bold">
              Connect your wallet
            </Text>
            <Text size="xs" color="secondary">
              Connect your wallet and sign a verification message to continue.
            </Text>
          </Stack>
          <Connect size="sm" fullwidth />
        </Stack>
      </Block>
    );
  }

  if (!token) {
    return <SiweSignIn />;
  }

  if (isPending) {
    return (
      <Block>
        <WhenLoaded loading={true} />
      </Block>
    );
  }

  if (data && !applyMode) {
    return <FormStatus data={data} reset={reset} />;
  }

  return <ApplyForm />;
};

export const DvtApply: FC = () => (
  <NoSSRWrapper>
    <DvtProviders>
      <DvtApplyContent />
    </DvtProviders>
  </NoSSRWrapper>
);
