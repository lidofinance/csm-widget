import { type OperatorKey } from 'modules/surveys-sdk';
import { type FileUploadItemDto } from 'modules/surveys-sdk/generated';
import { useSiweAuth } from 'modules/siwe';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
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

  // Ensure a valid SIWE token and RETURN it, so callers thread the fresh token
  // straight into uploadStaged. Returns undefined only when there's nothing to
  // upload (so callers can skip the sign-in stage).
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

  // Takes the token explicitly (from ensureAuth) rather than reading it from
  // the closure: a first-time sign-in in the same callback leaves the closure
  // token stale, which would upload with no auth header.
  const uploadStaged = useCallback(
    async (
      op: OperatorKey,
      files: FileUploadItemDto[],
      authToken: string | undefined,
    ): Promise<void> => {
      if (files.length === 0) return;
      transitStage(<TxStageDkgUploading count={files.length} />);
      await uploadDkgFilesRequest(op, files, authToken);
      await queryClient.invalidateQueries({ queryKey: dkgFilesKey(op) });
    },
    [transitStage, queryClient],
  );

  return { ensureAuth, uploadStaged };
};
