import { useMemo } from 'react';
import {
  TxStagePending,
  TxStageSuccess,
  useTransitStage,
} from 'shared/transaction-modal';
import { getFailedStage } from 'shared/transaction-modal/hooks';

export const useModalStages = () => {
  const transitStage = useTransitStage();

  return useMemo(
    () => ({
      pending: () =>
        transitStage(
          <TxStagePending
            title="Submitting your application form"
            description="sending to server"
          />,
        ),

      success: () =>
        transitStage(
          <TxStageSuccess
            title="Your application has been submitted"
            description="You can track your application's status on the Operator Type tab"
          />,
        ),

      failed: getFailedStage(transitStage, 'Submission failed'),
    }),
    [transitStage],
  );
};
