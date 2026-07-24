import { type OperatorKey } from 'modules/surveys-sdk';
import { type FileUploadItemDto } from 'modules/surveys-sdk/generated';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { type SurveyInFlowAuth } from '../../shared/use-survey-in-flow-auth';
import { useTransitStage } from 'shared/transaction-modal';
import { getGeneralTransactionModalStages } from 'shared/transaction-modal/hooks/get-general-transaction-modal-stages';
import { TxStageDkgSignin } from '../tx-stages/tx-stage-dkg-signin';
import { TxStageDkgUploading } from '../tx-stages/tx-stage-dkg-uploading';
import { dkgFilesKey } from './dkg-keys';
import { uploadDkgFilesRequest } from './upload-dkg-files-request';

// Takes the flow's shared SurveyInFlowAuth instance so the DKG upload and the
// members auto-init (create flow) read the same fresh token within one flow
// callback — two hook instances would each mirror the stale render-time token.
export const useDkgInFlowUpload = ({
  ensureAuth: ensureSurveyAuth,
  getToken,
}: SurveyInFlowAuth) => {
  const transitStage = useTransitStage();
  const queryClient = useQueryClient();

  const ensureAuth = useCallback(
    async (files: FileUploadItemDto[]): Promise<void> => {
      if (files.length === 0) return;
      try {
        await ensureSurveyAuth(<TxStageDkgSignin />);
      } catch (error) {
        getGeneralTransactionModalStages(transitStage).failed(error);
        throw error;
      }
    },
    [ensureSurveyAuth, transitStage],
  );

  const uploadStaged = useCallback(
    async (op: OperatorKey, files: FileUploadItemDto[]): Promise<void> => {
      if (files.length === 0) return;
      transitStage(<TxStageDkgUploading count={files.length} />);
      await uploadDkgFilesRequest(op, files, getToken());
      await queryClient.invalidateQueries({ queryKey: dkgFilesKey(op) });
    },
    [transitStage, queryClient, getToken],
  );

  return { ensureAuth, uploadStaged };
};
