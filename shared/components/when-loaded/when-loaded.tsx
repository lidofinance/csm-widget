import { FC, PropsWithChildren, ReactNode } from 'react';
import { WrapperStyle } from './style';
import { Loader } from '@lidofinance/lido-ui';

type Props = { loading: boolean; empty?: ReactNode };

export const WhenLoaded: FC<PropsWithChildren<Props>> = ({
  loading,
  empty,
  children,
}) => (
  <>
    {loading ? (
      <WrapperStyle>
        <Loader />
      </WrapperStyle>
    ) : empty ? (
      <WrapperStyle>{empty}</WrapperStyle>
    ) : (
      children
    )}
  </>
);
