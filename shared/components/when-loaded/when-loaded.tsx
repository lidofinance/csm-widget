import { Loader } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { EmptyState } from './empty-state';
import { WrapperStyle } from './style';

export type WhenLoaded = {
  loading: boolean;
  empty?: ReactNode;
  emptyNote?: string;
  error?: any;
  morePadding?: boolean;
};

export const WhenLoaded: FC<PropsWithChildren<WhenLoaded>> = ({
  loading,
  empty,
  emptyNote,
  children,
  error,
  morePadding,
}) => (
  <>
    {error ? (
      <>
        <WrapperStyle $morePadding={morePadding}>Error</WrapperStyle>
      </>
    ) : loading ? (
      <WrapperStyle $morePadding={morePadding}>
        <Loader data-testid="loader" />
      </WrapperStyle>
    ) : empty ? (
      <EmptyState note={emptyNote} morePadding={morePadding}>
        {empty}
      </EmptyState>
    ) : (
      children
    )}
  </>
);
