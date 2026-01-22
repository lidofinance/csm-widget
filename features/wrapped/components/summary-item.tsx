import { FC, ReactNode } from 'react';
import { Stack } from 'shared/components';
import { SummaryStatValue, SummaryStatLabel } from '../styles';

type SummaryItemProps = {
  value: ReactNode;
  label: string;
  show: boolean;
};

export const SummaryItem: FC<SummaryItemProps> = ({ value, label, show }) => {
  if (show === false) return null;

  return (
    <Stack direction="column" gap="none">
      <SummaryStatValue>{value}</SummaryStatValue>
      <SummaryStatLabel>{label}</SummaryStatLabel>
    </Stack>
  );
};
