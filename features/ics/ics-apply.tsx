import { Loader } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { ApplyForm } from './apply-form';
import { FormStatus } from './form-status';
import { IcsAuthProvider, useAuth, useFormStatus } from './shared';
import { SiweSignIn } from './siwe-sign-in';

const IcsApplyContent: FC = () => {
  const { token } = useAuth();
  const { data: statusData, isPending: isStatusLoading } = useFormStatus();

  if (!token) {
    return <SiweSignIn />;
  }

  if (isStatusLoading) {
    return <Loader />;
  }

  if (statusData) {
    return <FormStatus statusData={statusData} />;
  }

  return <ApplyForm />;
};

export const IcsApply: FC = () => {
  return (
    <NoSSRWrapper>
      <IcsAuthProvider>
        <IcsApplyContent />
        {/* <ApplyForm /> */}
      </IcsAuthProvider>
    </NoSSRWrapper>
  );
};
