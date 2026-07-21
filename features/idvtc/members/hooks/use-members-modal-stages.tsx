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
        title="Submitting cluster members"
        description="sending to server"
      />,
    ),
  success: () =>
    transitStage(
      <TxStageSuccess
        title="Cluster members updated"
        description="The change has been saved"
      />,
    ),
  failed: (error: unknown) => {
    let errorContent;
    if (
      typeof error === 'object' &&
      error !== null &&
      'details' in error &&
      Array.isArray((error as { details: unknown }).details)
    ) {
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
      />,
    );
  },
});

export const useMembersModalStages = () =>
  useTransactionModalStage(getModalStages).txModalStages;
