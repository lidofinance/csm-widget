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
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTransitStage } from 'shared/transaction-modal';
import { getGeneralTransactionModalStages } from 'shared/transaction-modal/hooks/get-general-transaction-modal-stages';
import { TxStageDkgSignin } from '../tx-stages/tx-stage-dkg-signin';
import { TxStageDkgUploading } from '../tx-stages/tx-stage-dkg-uploading';
import { dkgFilesKey } from './dkg-keys';

export const useDkgInFlowUpload = () => {
  const { token, authenticate } = useSiweAuth();
  const transitStage = useTransitStage();
  const queryClient = useQueryClient();

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
    async (op: OperatorKey, files: FileUploadItemDto[]): Promise<void> => {
      if (files.length === 0) return;
      transitStage(<TxStageDkgUploading count={files.length} />);
      await callSurvey(() =>
        filesUpload({
          ...surveyRequest(token),
          path: { nodeOperatorId: op },
          body: files,
        }),
      );
      await queryClient.invalidateQueries({ queryKey: dkgFilesKey(op) });
    },
    [token, transitStage, queryClient],
  );

  return { ensureAuth, uploadStaged };
};
