import { callSurvey, surveyRequest, useOperatorKey } from 'modules/surveys-sdk';
import { dispatchAuthError } from 'modules/surveys-sdk/api/errors';
import { useSiweAuth } from 'modules/siwe';
import {
  filesGetOne,
  type FileMetadataDto,
} from 'modules/surveys-sdk/generated';
import { useCallback, useState } from 'react';
import { downloadJson } from '../utils/download-file';

export const useDownloadDkgFile = () => {
  const op = useOperatorKey();
  const { token, handleAuthError } = useSiweAuth();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const download = useCallback(
    async (file: FileMetadataDto) => {
      if (!op) return;
      setDownloadingId(file.id);
      setError(null);
      try {
        const full = await callSurvey(() =>
          filesGetOne({
            ...surveyRequest(token),
            path: { nodeOperatorId: op, id: file.id },
          }),
        );
        if (full) downloadJson(full.name, full.content);
      } catch (e) {
        dispatchAuthError(e, token, handleAuthError);
        setError(e as Error);
      } finally {
        setDownloadingId(null);
      }
    },
    [op, token, handleAuthError],
  );

  return { download, downloadingId, error };
};
