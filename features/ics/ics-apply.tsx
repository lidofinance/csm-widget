import { Block, Text } from '@lidofinance/lido-ui';
import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { NoSSRWrapper, Stack, WhenLoaded } from 'shared/components';
import { Connect } from 'shared/wallet';
import { ApplyForm } from './apply-form';
import { FormStatus } from './form-status';
import { ProofStatus } from './form-status/proof-status';
import {
  IcsAuthProvider,
  IcsStateProvider,
  useAuth,
  useIcsState,
} from './shared';
import { SiweSignIn } from './siwe-sign-in';

const IcsApplyContent: FC = () => {
  const { isAccountActive } = useDappStatus();
  const { token } = useAuth();
  const { typeStatus, data, isPending, isTypePending, applyMode, reset } =
    useIcsState();

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

  if (isTypePending) {
    return (
      <Block>
        <WhenLoaded loading={true} />
      </Block>
    );
  }

  // FIXME: types
  if (typeStatus === 'CLAIMED') {
    return <ProofStatus typeStatus={typeStatus} />;
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
    return <FormStatus data={data} typeStatus={typeStatus} reset={reset} />;
  }

  if (!data && typeStatus !== 'PENDING') {
    return <ProofStatus typeStatus={typeStatus} />;
  }

  return <ApplyForm />;
};

export const IcsApply: FC = () => {
  return (
    <NoSSRWrapper>
      <IcsAuthProvider>
        <IcsStateProvider>
          <IcsApplyContent />
        </IcsStateProvider>
      </IcsAuthProvider>
    </NoSSRWrapper>
  );
};
