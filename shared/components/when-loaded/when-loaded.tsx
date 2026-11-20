import { EmptyState, Spinner } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import s from './when-loaded.module.css';

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
}) => {
  if (error) {
    return (
      <div className={s.center} data-more-padding={morePadding || undefined}>
        <EmptyState description="Error" />
      </div>
    );
  }
  if (loading) {
    return (
      <div className={s.center} data-more-padding={morePadding || undefined}>
        <Spinner data-testid="loader" />
      </div>
    );
  }
  if (empty) {
    return (
      <div className={s.center} data-more-padding={morePadding || undefined}>
        {typeof empty === 'string' ? (
          <EmptyState title={empty} description={emptyNote} />
        ) : (
          <>
            {empty}
            {emptyNote && <EmptyState description={emptyNote} />}
          </>
        )}
      </div>
    );
  }
  return <>{children}</>;
};
