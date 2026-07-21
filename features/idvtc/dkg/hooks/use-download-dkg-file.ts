import { callSurvey, surveyRequest, useOperatorKey } from 'modules/surveys-sdk';
import { useSiweAuth } from 'modules/siwe';
import {
  filesGetOne,
  type FileMetadataDto,
} from 'modules/surveys-sdk/generated';
import { useCallback, useState } from 'react';
import { downloadJson } from '../utils/download-file';

export const useDownloadDkgFile = () => {
  const op = useOperatorKey();
  const { token } = useSiweAuth();
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
        setError(e as Error);
      } finally {
        setDownloadingId(null);
      }
    },
    [op, token],
  );

  return { download, downloadingId, error };
};
