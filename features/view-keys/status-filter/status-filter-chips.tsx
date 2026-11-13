import { Stack, Tag } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { StatusChip, StatusChipId } from './get-status-chips';

type Props = {
  chips: StatusChip[];
  status: StatusChipId | undefined;
  onChange: (id: StatusChipId | undefined) => void;
};

export const StatusFilterChips: FC<Props> = ({ chips, status, onChange }) => (
  <Stack direction="row" wrap gap={8}>
    {chips.map(({ id, label, variant, count }) =>
      id === status ? (
        <Tag
          key={id}
          variant={variant}
          active
          onClose={() => onChange(undefined)}
        >
          {label} {count}
        </Tag>
      ) : (
        <Tag
          key={id}
          variant={count === 0 ? 'neutral' : variant}
          as="button"
          disabled={count === 0}
          onClick={() => onChange(id)}
        >
          {label} {count}
        </Tag>
      ),
    )}
  </Stack>
);
