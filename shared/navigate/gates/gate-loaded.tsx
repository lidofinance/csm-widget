import { FC, PropsWithChildren, ReactNode } from 'react';
import { useInitialLoading } from 'shared/hooks';
import { SplashPage, UnsupportedPage } from '../inner-pages';

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
  const { isLoading, isSupported } = useInitialLoading(additional);

  if (!isSupported) {
    return <>{unsupported}</>;
  }

  return <>{isLoading ? fallback : children}</>;
};
