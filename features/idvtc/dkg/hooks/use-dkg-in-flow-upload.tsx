import { type OperatorKey } from 'modules/surveys-sdk';
import { type FileUploadItemDto } from 'modules/surveys-sdk/generated';
import { useSiweAuth } from 'modules/siwe';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { useTransitStage } from 'shared/transaction-modal';
import { getGeneralTransactionModalStages } from 'shared/transaction-modal/hooks/get-general-transaction-modal-stages';
import { TxStageDkgSignin } from '../tx-stages/tx-stage-dkg-signin';
import { TxStageDkgUploading } from '../tx-stages/tx-stage-dkg-uploading';
import { dkgFilesKey } from './dkg-keys';
import { uploadDkgFilesRequest } from './upload-dkg-files-request';

export const useDkgInFlowUpload = () => {
  const { token, authenticate } = useSiweAuth();
  const transitStage = useTransitStage();
  const queryClient = useQueryClient();

  // uploadStaged can run in the same callback as ensureAuth (add-keys), where
  // the context `token` from this render is still the pre-sign-in value. Mirror
  // the latest token in a ref — kept current across renders and updated eagerly
  // by ensureAuth — so uploadStaged always sends the fresh token.
  const tokenRef = useRef(token);
  tokenRef.current = token;

  const ensureAuth = useCallback(
    async (files: FileUploadItemDto[]): Promise<void> => {
      if (files.length === 0 || tokenRef.current) return;
      transitStage(<TxStageDkgSignin />);
      try {
        tokenRef.current = await authenticate();
      } catch (error) {
        getGeneralTransactionModalStages(transitStage).failed(error);
        throw error;
      }
    },
    [authenticate, transitStage],
  );

  const uploadStaged = useCallback(
    async (op: OperatorKey, files: FileUploadItemDto[]): Promise<void> => {
      if (files.length === 0) return;
      transitStage(<TxStageDkgUploading count={files.length} />);
      await uploadDkgFilesRequest(op, files, tokenRef.current);
      await queryClient.invalidateQueries({ queryKey: dkgFilesKey(op) });
    },
    [transitStage, queryClient],
  );

  return { ensureAuth, uploadStaged };
};
