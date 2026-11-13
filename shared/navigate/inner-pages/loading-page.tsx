import { useNodeOperator } from 'modules/web3';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import { SplashPage } from './splash-page';

export const LoadingPage: FC = () => {
  const { isDiscovering } = useNodeOperator();
  return isDiscovering ? <Layout /> : <SplashPage />;
};
