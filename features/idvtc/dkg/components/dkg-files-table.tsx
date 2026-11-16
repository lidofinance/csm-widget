import { FC, useCallback, useState } from 'react';
import {
  Body,
  IconButton,
  IconDownload,
  IconTrash,
  Stack,
  Switch,
} from '@lidofinance/lido-app-ui';
import type { FileMetadataDto } from 'modules/surveys-sdk/generated';
import { useToggleDkgFile } from '../hooks/use-toggle-dkg-file';
import { useDeleteDkgFile } from '../hooks/use-delete-dkg-file';
import { useDownloadDkgFile } from '../hooks/use-download-dkg-file';
import { useDkgDeleteConfirm } from './dkg-delete-confirm-modal';
import {
  DkgRow,
  DkgTable,
  DkgTableHead,
  FileName,
  RowActions,
} from '../styles';

const ERROR_ICON_STYLE = { color: 'var(--lido-app-ui-color-icons-error)' };

const DkgDeleteButton: FC<{
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}> = ({ onClick, disabled, danger }) => (
  <IconButton
    icon={<IconTrash style={danger ? ERROR_ICON_STYLE : undefined} />}
    variant="ghost"
    type="button"
    disabled={disabled}
    onClick={onClick}
    aria-label="Delete"
    title="Delete"
  />
);

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
          <Body color="tertiary">Status</Body>
          <Body color="tertiary">Filename</Body>
          <Body color="tertiary">Actions</Body>
        </DkgTableHead>
        {files.map((file) => {
          const busy = busyId === file.id;
          return (
            <DkgRow key={file.id} $columns="64px 1fr auto">
              <Switch
                checked={file.active}
                disabled={!canManage || busy}
                aria-label={`Toggle ${file.name}`}
                onChange={(e) => void onToggle(file, e.target.checked)}
              />
              <FileName $inactive={!file.active}>{file.name}</FileName>
              <RowActions>
                <IconButton
                  icon={<IconDownload />}
                  variant="ghost"
                  type="button"
                  loading={downloadingId === file.id}
                  onClick={() => void download(file)}
                  aria-label="Download"
                  title="Download"
                />
                {canManage && (
                  <DkgDeleteButton
                    disabled={busy}
                    onClick={() => void onDelete(file)}
                  />
                )}
              </RowActions>
            </DkgRow>
          );
        })}
      </DkgTable>
      {actionError && <Body color="error">{actionError.message}</Body>}
    </>
  );
};

type StagedProps = {
  items: { name: string }[];
  onRemove: (index: number) => void;
};

// Staged files exist only client-side until the parent flow uploads them.
export const DkgStagedTable: FC<StagedProps> = ({ items, onRemove }) => {
  if (items.length === 1) {
    return (
      <Stack direction="row" align="center" gap={8}>
        <FileName>
          <Body as="span" weight="semibold">
            Attached file:
          </Body>{' '}
          {items[0].name}
        </FileName>
        <DkgDeleteButton danger onClick={() => onRemove(0)} />
      </Stack>
    );
  }

  return (
    <DkgTable>
      {items.map((item, index) => (
        <DkgRow key={`${item.name}-${index}`} $columns="1fr auto">
          <FileName>{item.name}</FileName>
          <RowActions>
            <DkgDeleteButton onClick={() => onRemove(index)} />
          </RowActions>
        </DkgRow>
      ))}
    </DkgTable>
  );
};
