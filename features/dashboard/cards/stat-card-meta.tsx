import { Stack } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import s from './stat-card-meta.module.css';

export type StatCardMetaItem = { label: ReactNode; value: ReactNode };

type StatCardMetaProps = {
  items: StatCardMetaItem[];
  className?: string;
};

export const StatCardMeta: FC<StatCardMetaProps> = ({ items, className }) => (
  <Stack direction="row" wrap rowGap={4} columnGap={12} className={className}>
    {items.map((item, index) => (
      <span key={index} className={s.item}>
        <span className={s.label}>{item.label}:</span>{' '}
        <span className={s.value}>{item.value}</span>
      </span>
    ))}
  </Stack>
);
