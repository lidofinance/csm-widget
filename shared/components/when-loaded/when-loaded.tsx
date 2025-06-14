import { FC, PropsWithChildren, ReactNode } from 'react';
import { WrapperStyle } from './style';
import { Loader } from '@lidofinance/lido-ui';
import { Note } from '../note/note';

type Props = {
  loading: boolean;
  empty?: ReactNode;
  emptyNote?: string;
  error?: any;
};

export const WhenLoaded: FC<PropsWithChildren<Props>> = ({
  loading,
  empty,
  emptyNote,
  children,
  error,
}) => (
  <>
    {error ? (
      <>
        <WrapperStyle>Error</WrapperStyle>
      </>
    ) : loading ? (
      <WrapperStyle>
        <Loader data-testid="loader" />
      </WrapperStyle>
    ) : empty ? (
      <>
        <WrapperStyle>{empty}</WrapperStyle>
        {emptyNote && <Note>{emptyNote}</Note>}
      </>
    ) : (
      children
    )}
  </>
);
