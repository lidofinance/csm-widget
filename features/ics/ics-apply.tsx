import { Block } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { NoSSRWrapper, WhenLoaded } from 'shared/components';
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
  const { token } = useAuth();
  const { typeStatus, data, isPending, isTypePending, applyMode, reset } =
    useIcsState();

  if (isTypePending) {
    return (
      <Block>
        <WhenLoaded loading={true} />
      </Block>
    );
  }

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
