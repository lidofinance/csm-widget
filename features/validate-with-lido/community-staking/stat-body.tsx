import { Skeleton } from '@lidofinance/lido-app-ui';
import type { ComponentProps, ReactNode } from 'react';
import type { Stat } from './use-csm-stats';

export const isStatVisible = <T,>({ isLoading, value }: Stat<T>) =>
  isLoading || value !== undefined;

type StatBodyProps<T> = {
  stat: Stat<T>;
  format: (value: T) => ReactNode;
  skeletonStyle?: ComponentProps<typeof Skeleton>['style'];
};

export const StatBody = <T,>({
  stat,
  format,
  skeletonStyle,
}: StatBodyProps<T>) =>
  stat.isLoading || stat.value === undefined ? (
    <Skeleton variant="text" style={skeletonStyle} />
  ) : (
    <>{format(stat.value)}</>
  );
