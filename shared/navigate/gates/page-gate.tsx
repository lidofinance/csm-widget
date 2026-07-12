import { PATH } from 'consts/urls';
import { FC, PropsWithChildren } from 'react';
import { useInitialLoading, useShowFlagsState } from 'shared/hooks';
import { SplashPage } from '../inner-pages';
import { Navigate } from '../navigate';
import { evalGuards, ROUTE_GUARDS } from './route-guards';

type Props = {
  path?: PATH;
  dataLoading?: boolean; // page-data loading, applied after access is granted
};

export const PageGate: FC<PropsWithChildren<Props>> = ({
  path,
  dataLoading,
  children,
}) => {
  const flags = useShowFlagsState();
  const isInitialLoading = useInitialLoading();

  if (isInitialLoading) return <SplashPage />;

  const pageGuards = (path ? ROUTE_GUARDS[path] : undefined) ?? [];
  const verdict = evalGuards(pageGuards, flags);
  if (verdict.status === 'pending') return <SplashPage />;
  if (verdict.status === 'redirect') return <Navigate path={verdict.to} />;

  if (dataLoading) return <SplashPage />;

  return <>{children}</>;
};
