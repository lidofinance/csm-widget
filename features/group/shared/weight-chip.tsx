import { FC } from 'react';
import { SquaredChip } from 'shared/components';
import { formatBP } from 'utils';

export const WeightChip: FC<{ weight: bigint | undefined }> = ({ weight }) =>
  weight !== undefined ? (
    <SquaredChip>Weight: {formatBP(weight)}</SquaredChip>
  ) : null;
