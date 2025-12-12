import { FC, PropsWithChildren } from 'react';
import { PATH } from 'consts/urls';
import { Navigate } from 'shared/navigate';
import { WhenLoaded } from 'shared/components';
import { useSurveyContext } from './survey-provider';

export const SurveyOperatorGate: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, isOperator } = useSurveyContext();

  return (
    <WhenLoaded loading={isLoading}>
      {isOperator ? children : <Navigate path={PATH.SURVEYS} />}
    </WhenLoaded>
  );
};
