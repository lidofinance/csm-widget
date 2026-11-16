import { EmptyState, Spinner } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import styled from 'styled-components';

export type WhenLoaded = {
  loading: boolean;
  empty?: ReactNode;
  emptyNote?: string;
  error?: any;
  morePadding?: boolean;
};

const CenterStyle = styled.div<{ $morePadding?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $morePadding }) => ($morePadding ? 48 : 16)}px 0;
`;

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
      <CenterStyle $morePadding={morePadding}>
        <EmptyState description="Error" />
      </CenterStyle>
    );
  }
  if (loading) {
    return (
      <CenterStyle $morePadding={morePadding}>
        <Spinner data-testid="loader" />
      </CenterStyle>
    );
  }
  if (empty) {
    return (
      <CenterStyle $morePadding={morePadding}>
        {typeof empty === 'string' ? (
          <EmptyState title={empty} description={emptyNote} />
        ) : (
          <>
            {empty}
            {emptyNote && <EmptyState description={emptyNote} />}
          </>
        )}
      </CenterStyle>
    );
  }
  return <>{children}</>;
};
