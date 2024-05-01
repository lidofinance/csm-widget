import { SplashPage } from 'features/loader';
import { WelcomePage } from 'features/welcome';
import Page404 from 'pages/404';
import { useNodeOperator } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { useAccount } from 'shared/hooks';

type Props = {
  fallback?: ReactNode;
};

export const OnlyNodeOperator: FC<PropsWithChildren<Props>> = ({
  children,
  fallback,
}) => {
  const { active: isConnected } = useAccount();
  const { active, isListLoading } = useNodeOperator();

  if (isConnected && active) return children;
  if (isListLoading) return <SplashPage />;
  if (!isConnected) return <WelcomePage />;
  if (fallback) return fallback;

  // TODO: redirect to correct page
  return <Page404 />;
};
