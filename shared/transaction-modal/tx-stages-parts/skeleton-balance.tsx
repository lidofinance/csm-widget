import { Skeleton } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import s from './skeleton-balance.module.css';

/** Inline placeholder for a balance that is still loading. */
export const SkeletonBalance: FC = () => (
  <Skeleton variant="text" width={100} className={s.root} />
);
