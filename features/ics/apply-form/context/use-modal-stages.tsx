import {
  TransactionModalTransitStage,
  TxStageFail,
  TxStagePending,
  TxStageSuccess,
  useTransactionModalStage,
} from 'shared/transaction-modal';
import { extractErrorMessage, getErrorCode } from 'utils';

const getModalStages = (transitStage: TransactionModalTransitStage) => ({
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
        description="You can track your application’s status on the Operator Type tab."
      />,
    ),

  failed: (error: unknown, onRetry?: () => void) => {
    let errorContent;

    if (typeof error === 'object' && error !== null && 'details' in error) {
      const errorObj = error as { message: string; details: string[] };
      errorContent = (
        <>
          <span>{errorObj.message}</span>
          <br />
          {errorObj.details.length > 0 && (
            <ul>
              {errorObj.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          )}
        </>
      );
    } else {
      errorContent = extractErrorMessage(error);
    }

    return transitStage(
      <TxStageFail
        title="Submission failed"
        error={errorContent}
        code={getErrorCode(error)}
        onRetry={onRetry}
      />,
    );
  },
});

export const useModalStages = () => useTransactionModalStage(getModalStages);
