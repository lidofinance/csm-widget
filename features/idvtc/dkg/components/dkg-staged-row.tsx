import { FC } from 'react';
import { IconButton, StagedRow } from '../styles';
import { TrashIcon } from './trash-icon';

type Props = {
  name: string;
  onRemove: () => void;
};

export const DkgStagedRow: FC<Props> = ({ name, onRemove }) => (
  <StagedRow>
    <span>{name}</span>
    <IconButton type="button" onClick={onRemove} aria-label="Remove">
      <TrashIcon />
    </IconButton>
  </StagedRow>
);
