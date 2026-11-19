import { Skeleton } from '@lidofinance/lido-app-ui';
import type { ReactNode } from 'react';
import type { Stat } from './use-csm-stats';

export const isStatVisible = <T,>({ isLoading, value }: Stat<T>) =>
  isLoading || value !== undefined;

type StatBodyProps<T> = {
  stat: Stat<T>;
  format: (value: T) => ReactNode;
  skeletonWidth?: number;
  skeletonHeight?: number;
};

export const StatBody = <T,>({
  stat,
  format,
  skeletonWidth,
  skeletonHeight,
}: StatBodyProps<T>) =>
  stat.isLoading || stat.value === undefined ? (
    <Skeleton variant="text" width={skeletonWidth} height={skeletonHeight} />
  ) : (
    <>{format(stat.value)}</>
  );
