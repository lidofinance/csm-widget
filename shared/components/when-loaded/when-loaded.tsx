import { FC, PropsWithChildren, ReactNode } from 'react';
import { WrapperStyle } from './style';
import { Loader } from '@lidofinance/lido-ui';
import { Note } from '../note/note';

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
      <>
        <WrapperStyle $morePadding={morePadding}>{empty}</WrapperStyle>
        {emptyNote && <Note>{emptyNote}</Note>}
      </>
    ) : (
      children
    )}
  </>
);
