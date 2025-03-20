import { FC, PropsWithChildren, ReactNode } from 'react';
import { useAuth } from './survey-auth-provider';

type GateProps = {
  fallback?: ReactNode;
};

export const GateSurveyAuth: FC<PropsWithChildren<GateProps>> = ({
  fallback,
  children,
}) => {
  const { token } = useAuth();
  const canShow = !!token;

  return <>{canShow ? children : fallback}</>;
};
