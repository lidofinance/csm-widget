import { FC } from 'react';
import { SquaredChip } from 'shared/components';
import { formatBP } from 'utils';

export const WeightChip: FC<{ weight: bigint | undefined }> = ({
  weight,
  ...props
}) =>
  weight !== undefined ? (
    <SquaredChip {...props}>Weight: {formatBP(weight)}</SquaredChip>
  ) : null;
