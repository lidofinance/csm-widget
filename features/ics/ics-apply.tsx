import { FC, useCallback } from 'react';
import { Loader } from '@lidofinance/lido-ui';
import { NoSSRWrapper } from 'shared/components';
import { ApplyForm } from './apply-form';
import { IcsProvider, useAuth, useFormStatus } from './shared';
import { SiweSignIn } from './siwe-sign-in';
import { FormStatus } from './form-status';

const IcsApplyContent: FC = () => {
  const { token } = useAuth();
  const { data: statusData, isLoading: isStatusLoading, refetch } = useFormStatus();

  const handleRetryOrContinue = useCallback(() => {
    void refetch();
  }, [refetch]);

  // Not signed in - show sign in form
  if (!token) {
    return <SiweSignIn />;
  }

  // Loading form status after sign in
  if (isStatusLoading) {
    return <Loader />;
  }

  // Has submitted form - show status
  if (statusData && statusData.status !== 'none') {
    return (
      <FormStatus 
        statusData={statusData} 
        onRetry={statusData.status === 'rejected' || statusData.status === 'draft' ? handleRetryOrContinue : undefined}
      />
    );
  }

  // No submitted form - show application form
  return <ApplyForm />;
};

export const IcsApply: FC = () => {
  return (
    <NoSSRWrapper>
      <IcsProvider>
        <IcsApplyContent />
      </IcsProvider>
    </NoSSRWrapper>
  );
};
