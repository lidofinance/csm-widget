import { FC } from 'react';
import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';
import type { FileMetadataDto } from 'modules/surveys-sdk/generated';
import { DkgFileToggle } from './dkg-file-toggle';
import { Actions, IconButton, Row } from '../styles';
import { TrashIcon } from './trash-icon';

type Props = {
  file: FileMetadataDto;
  canManage: boolean;
  busy?: boolean;
  downloading?: boolean;
  onToggle: (active: boolean) => void;
  onDelete: () => void;
  onDownload: () => void;
};

export const DkgFileRow: FC<Props> = ({
  file,
  canManage,
  busy,
  downloading,
  onToggle,
  onDelete,
  onDownload,
}) => (
  <Row>
    <DkgFileToggle
      on={file.active}
      disabled={!canManage || busy}
      onToggle={onToggle}
    />
    <span>{file.name}</span>
    <Actions>
      <IconButton
        type="button"
        onClick={onDownload}
        disabled={downloading}
        aria-label="Download"
      >
        <DownloadIcon />
      </IconButton>
      {canManage && (
        <IconButton
          type="button"
          onClick={onDelete}
          disabled={busy}
          aria-label="Delete"
        >
          <TrashIcon />
        </IconButton>
      )}
    </Actions>
  </Row>
);
