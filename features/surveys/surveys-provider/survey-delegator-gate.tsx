import { FC, PropsWithChildren } from 'react';
import { PATH } from 'consts/urls';
import { Navigate } from 'shared/navigate';
import { WhenLoaded } from 'shared/components';
import { useSurveyContext } from './survey-provider';

type Props = {
  operatorId: string;
};

export const SurveyDelegatorGate: FC<PropsWithChildren<Props>> = ({
  operatorId,
  children,
}) => {
  const { isLoading, delegatedOperators } = useSurveyContext();

  return (
    <WhenLoaded loading={isLoading}>
      {delegatedOperators.includes(operatorId) ? (
        children
      ) : (
        <Navigate path={PATH.SURVEYS} />
      )}
    </WhenLoaded>
  );
};
