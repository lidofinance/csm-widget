import { FC, useCallback, useMemo, useState } from 'react';
import {
  Body,
  IconButton,
  IconDownload,
  IconTrash,
  Stack,
  Switch,
  Table,
  TableColumn,
} from '@lidofinance/lido-app-ui';
import type { FileMetadataDto } from 'modules/surveys-sdk/generated';
import { useToggleDkgFile } from '../hooks/use-toggle-dkg-file';
import { useDeleteDkgFile } from '../hooks/use-delete-dkg-file';
import { useDownloadDkgFile } from '../hooks/use-download-dkg-file';
import { useDkgDeleteConfirm } from './dkg-delete-confirm-modal';
import { DkgRow, DkgTable, RowActions } from '../styles';

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

const getFileKey = ({ id }: FileMetadataDto) => String(id);

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

  const columns = useMemo<TableColumn<FileMetadataDto>[]>(
    () => [
      {
        key: 'active',
        header: 'Status',
        width: 80,
        render: (file) => (
          <Switch
            checked={file.active}
            disabled={!canManage || busyId === file.id}
            aria-label={`Toggle ${file.name}`}
            onChange={(e) => void onToggle(file, e.target.checked)}
          />
        ),
      },
      {
        key: 'name',
        header: 'Filename',
        render: (file) => (
          <Body truncate color={file.active ? undefined : 'tertiary'}>
            {file.name}
          </Body>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        width: 120,
        render: (file) => (
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
                disabled={busyId === file.id}
                onClick={() => void onDelete(file)}
              />
            )}
          </RowActions>
        ),
      },
    ],
    [canManage, busyId, downloadingId, download, onToggle, onDelete],
  );

  return (
    <>
      <Table
        variant="dense"
        columns={columns}
        rows={files}
        rowKey={getFileKey}
      />
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
        <Body truncate>
          <Body as="span" weight="semibold">
            Attached file:
          </Body>{' '}
          {items[0].name}
        </Body>
        <DkgDeleteButton danger onClick={() => onRemove(0)} />
      </Stack>
    );
  }

  return (
    <DkgTable>
      {items.map((item, index) => (
        <DkgRow key={`${item.name}-${index}`} $columns="1fr auto">
          <Body truncate>{item.name}</Body>
          <RowActions>
            <DkgDeleteButton onClick={() => onRemove(index)} />
          </RowActions>
        </DkgRow>
      ))}
    </DkgTable>
  );
};
