import { FC } from 'react';
import { TxStagePending } from 'shared/transaction-modal';

export const TxStageDkgUploading: FC<{ count: number }> = ({ count }) => (
  <TxStagePending
    title="Uploading DKG files"
    description={`Uploading ${count} DKG file(s)…`}
  />
);
