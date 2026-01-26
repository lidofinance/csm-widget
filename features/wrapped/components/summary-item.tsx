import { FC, ReactNode } from 'react';
import { Stack } from 'shared/components';
import { SummaryStatValue, SummaryStatLabel } from '../styles';

type SummaryItemProps = {
  value: ReactNode;
  label: string;
  show: boolean;
  same?: boolean;
};

export const SummaryItem: FC<SummaryItemProps> = ({
  value,
  label,
  show,
  same,
}) => {
  if (show === false) return null;

  return (
    <Stack direction="column" gap="none">
      <SummaryStatValue $same={same}>{value}</SummaryStatValue>
      <SummaryStatLabel $same={same}>{label}</SummaryStatLabel>
    </Stack>
  );
};
