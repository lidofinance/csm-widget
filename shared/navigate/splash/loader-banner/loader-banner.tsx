import { Loader } from '@lidofinance/lido-ui';
import { FC } from 'react';

import { LoaderWrapperStyle } from './styles';

export const LoaderBanner: FC = () => {
  return (
    <LoaderWrapperStyle>
      <Loader size="large" />
    </LoaderWrapperStyle>
  );
};
