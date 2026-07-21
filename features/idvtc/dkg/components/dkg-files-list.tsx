import { FC, useCallback, useState } from 'react';
import { Text } from '@lidofinance/lido-ui';
import type { FileMetadataDto } from 'modules/surveys-sdk/generated';
import { useToggleDkgFile } from '../hooks/use-toggle-dkg-file';
import { useDeleteDkgFile } from '../hooks/use-delete-dkg-file';
import { useDownloadDkgFile } from '../hooks/use-download-dkg-file';
import { useDkgDeleteConfirm } from './dkg-delete-confirm-modal';
import { DkgFileRow } from './dkg-file-row';
import { HeaderRow, Table } from '../styles';

type Props = { files: FileMetadataDto[]; canManage: boolean };

export const DkgFilesList: FC<Props> = ({ files, canManage }) => {
  const toggle = useToggleDkgFile();
  const remove = useDeleteDkgFile();
  const {
    download,
    downloadingId,
    error: downloadError,
  } = useDownloadDkgFile();
  const confirmDelete = useDkgDeleteConfirm();
  const [busyId, setBusyId] = useState<number | undefined>();

  const actionError = remove.error ?? toggle.error ?? downloadError;

  const onToggle = useCallback(
    async (file: FileMetadataDto, active: boolean) => {
      setBusyId(file.id);
      try {
        await toggle.mutateAsync({ id: file.id, active });
      } finally {
        setBusyId(undefined);
      }
    },
    [toggle],
  );

  const onDelete = useCallback(
    async (file: FileMetadataDto) => {
      const ok = await confirmDelete({ fileName: file.name });
      if (!ok) return;
      setBusyId(file.id);
      try {
        await remove.mutateAsync(file.id);
      } finally {
        setBusyId(undefined);
      }
    },
    [confirmDelete, remove],
  );

  return (
    <Table>
      <HeaderRow>
        <span>Status&nbsp;&nbsp;Filename</span>
        <span>Actions</span>
      </HeaderRow>
      {files.map((file) => (
        <DkgFileRow
          key={file.id}
          file={file}
          canManage={canManage}
          busy={busyId === file.id}
          downloading={downloadingId === file.id}
          onToggle={(active) => void onToggle(file, active)}
          onDelete={() => void onDelete(file)}
          onDownload={() => void download(file)}
        />
      ))}
      {actionError && (
        <Text size="xs" color="error">
          {actionError.message}
        </Text>
      )}
    </Table>
  );
};
