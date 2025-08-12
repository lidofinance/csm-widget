import { useCallback } from 'react';
import { useModalStages } from 'shared/hooks';
import type { ApplyFormInputType } from './types';

const useTxModalStages = () => {
  return [
    {
      sign: {
        title: 'Submit Application',
        description: 'Please confirm your ICS application submission...',
      },
      pending: {
        title: 'Submitting Application',
        description: 'Your application is being processed...',
      },
      success: {
        title: 'Application Submitted',
        description: 'Your ICS application has been successfully submitted. You will receive a confirmation email shortly.',
      },
    },
  ];
};

interface UseApplyFormSubmitOptions {
  onConfirm: () => void;
  onRetry: () => void;
}

export const useApplyFormSubmit = ({ onConfirm, onRetry }: UseApplyFormSubmitOptions) => {
  const stages = useTxModalStages();
  const { dispatchModalState, retryEvent } = useModalStages();

  const submitAction = useCallback(
    async (data: ApplyFormInputType) => {
      try {
        await dispatchModalState({
          stages,
          callbacks: {
            onSign: async () => {
              // TODO: Implement actual API call to submit application
              console.log('Submitting application:', data);
              
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // For now, just log the data
              console.log('Application data:', {
                mainAddress: data.mainAddress,
                additionalAddresses: data.additionalAddresses,
                socialProof: data.socialProof,
              });
            },
            onConfirm,
          },
        });
      } catch (error) {
        console.error('Failed to submit application:', error);
        throw error;
      }
    },
    [dispatchModalState, stages, onConfirm]
  );

  return {
    submitAction,
    retryEvent: useCallback(() => {
      retryEvent();
      onRetry();
    }, [retryEvent, onRetry]),
  };
};