import { FC } from 'react';
import { WhenLoaded } from 'shared/components';
import { DelegatorHome } from '../survey-delegator';
import { useSurveyContext } from '../surveys-provider';
import { SurveysOperatorHome } from './surverys-operator-home';
import { SurveysEmpty } from './surveys-empty';

export const SurveysHome: FC = () => {
  const { mode, isLoading } = useSurveyContext();

  return (
    <WhenLoaded
      loading={isLoading}
      empty={mode.type === 'empty' && <SurveysEmpty />}
    >
      {mode.type === 'delegator' ? <DelegatorHome /> : <SurveysOperatorHome />}
    </WhenLoaded>
  );
};
