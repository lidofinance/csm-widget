import { FC, PropsWithChildren, ReactNode } from 'react';
import { useInitialLoading } from 'shared/hooks';
import { SplashPage } from '../inner-pages';

type Props = {
  fallback?: ReactNode;
  additional?: boolean;
};

export const GateLoaded: FC<PropsWithChildren<Props>> = ({
  fallback = <SplashPage />,
  additional,
  children,
}) => {
  const isLoading = useInitialLoading(additional);

  return <>{isLoading ? fallback : children}</>;
};
