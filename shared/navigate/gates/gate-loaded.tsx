import { FC, PropsWithChildren, ReactNode } from 'react';
import { useInitialLoading } from 'shared/hooks';
import { SplashPage, UnsupportedPage } from '../inner-pages';
import { useCsmVersionSupported } from 'modules/web3';

type Props = {
  fallback?: ReactNode;
  unsupported?: ReactNode;
  additional?: boolean;
};

export const GateLoaded: FC<PropsWithChildren<Props>> = ({
  fallback = <SplashPage />,
  unsupported = <UnsupportedPage />,
  additional,
  children,
}) => {
  const isLoading = useInitialLoading(additional);
  const { data: isSupported } = useCsmVersionSupported();

  return <>{isLoading ? fallback : isSupported ? children : unsupported}</>;
};
