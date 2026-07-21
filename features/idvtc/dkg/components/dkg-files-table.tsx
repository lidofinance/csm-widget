import { FC, useCallback, useState } from 'react';
import { ButtonIcon, Text } from '@lidofinance/lido-ui';
import type { FileMetadataDto } from 'modules/surveys-sdk/generated';
import { Stack } from 'shared/components';
import { useToggleDkgFile } from '../hooks/use-toggle-dkg-file';
import { useDeleteDkgFile } from '../hooks/use-delete-dkg-file';
import { useDownloadDkgFile } from '../hooks/use-download-dkg-file';
import { useDkgDeleteConfirm } from './dkg-delete-confirm-modal';
import { DkgFileToggle } from './dkg-file-toggle';
import {
  DkgRow,
  DkgTable,
  DkgTableHead,
  FileName,
  RowActions,
} from '../styles';

import { ReactComponent as DownloadIcon } from 'assets/icons/download-2.svg';
import { ReactComponent as Trash } from 'assets/icons/trash.svg';

type Props = { files: FileMetadataDto[]; canManage: boolean };

// Managed variant: toggle · filename · download + delete. Read-only viewers
// keep the toggle (disabled) and download, but lose the delete action.
export const DkgFilesTable: FC<Props> = ({ files, canManage }) => {
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
    <>
      <DkgTable>
        <DkgTableHead>
          <Stack gap="sm">
            <Text size="xxs" color="secondary">
              Status
            </Text>
            <Text size="xxs" color="secondary">
              Filename
            </Text>
          </Stack>
          <Text size="xxs" color="secondary">
            Actions
          </Text>
        </DkgTableHead>
        {files.map((file) => {
          const busy = busyId === file.id;
          return (
            <DkgRow key={file.id} $columns="auto 1fr auto">
              <DkgFileToggle
                on={file.active}
                disabled={!canManage || busy}
                onToggle={(active) => void onToggle(file, active)}
              />
              <FileName $inactive={!file.active}>{file.name}</FileName>
              <RowActions>
                <ButtonIcon
                  icon={<DownloadIcon />}
                  variant="ghost"
                  size="xxs"
                  color="primary"
                  type="button"
                  loading={downloadingId === file.id}
                  onClick={() => void download(file)}
                  aria-label="Download"
                  title="Download"
                />
                {canManage && (
                  <ButtonIcon
                    icon={<Trash />}
                    variant="ghost"
                    size="xxs"
                    color="error"
                    type="button"
                    disabled={busy}
                    onClick={() => void onDelete(file)}
                    aria-label="Delete"
                    title="Delete"
                  />
                )}
              </RowActions>
            </DkgRow>
          );
        })}
      </DkgTable>
      {actionError && (
        <Text size="xs" color="error">
          {actionError.message}
        </Text>
      )}
    </>
  );
};

type StagedProps = {
  items: { name: string }[];
  onRemove: (index: number) => void;
};

// Staged variant: filename · delete only. No header, toggle or download —
// these files exist only client-side until the parent flow uploads them.
export const DkgStagedTable: FC<StagedProps> = ({ items, onRemove }) => (
  <DkgTable>
    {items.map((item, index) => (
      <DkgRow key={`${item.name}-${index}`} $columns="1fr auto">
        <FileName>{item.name}</FileName>
        <RowActions>
          <ButtonIcon
            icon={<Trash />}
            variant="ghost"
            size="xxs"
            color="error"
            type="button"
            onClick={() => onRemove(index)}
            aria-label="Delete"
            title="Delete"
          />
        </RowActions>
      </DkgRow>
    ))}
  </DkgTable>
);
