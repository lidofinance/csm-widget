import {
  callSurvey,
  surveyRequest,
  type OperatorKey,
} from 'modules/surveys-sdk';
import {
  filesUpload,
  type FileUploadItemDto,
} from 'modules/surveys-sdk/generated';
import { useSiweAuth } from 'modules/siwe';
import { useCallback } from 'react';
import { useTransitStage } from 'shared/transaction-modal';
import { getGeneralTransactionModalStages } from 'shared/transaction-modal/hooks/get-general-transaction-modal-stages';
import { TxStageDkgSignin } from '../tx-stages/tx-stage-dkg-signin';
import { TxStageDkgUploading } from '../tx-stages/tx-stage-dkg-uploading';

export const useDkgInFlowUpload = () => {
  const { token, authenticate } = useSiweAuth();
  const transitStage = useTransitStage();

  // Returns a usable token. Signs in only if there are files and no token yet.
  // authenticate() drives NO modal and THROWS on reject/fail, so we show the
  // standard failed stage and re-throw so the flow's catch aborts the tx.
  const ensureAuth = useCallback(
    async (files: FileUploadItemDto[]): Promise<string | undefined> => {
      if (files.length === 0) return undefined;
      if (token) return token;
      transitStage(<TxStageDkgSignin />);
      try {
        return await authenticate();
      } catch (error) {
        getGeneralTransactionModalStages(transitStage).failed(error);
        throw error;
      }
    },
    [token, authenticate, transitStage],
  );

  const uploadStaged = useCallback(
    async (
      op: OperatorKey,
      files: FileUploadItemDto[],
      authToken?: string,
    ): Promise<void> => {
      if (files.length === 0) return;
      transitStage(<TxStageDkgUploading count={files.length} />);
      await callSurvey(() =>
        filesUpload({
          ...surveyRequest(authToken ?? token),
          path: { nodeOperatorId: op },
          body: files,
        }),
      );
    },
    [token, transitStage],
  );

  return { ensureAuth, uploadStaged };
};
