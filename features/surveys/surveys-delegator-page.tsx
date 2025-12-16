import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { BackButton } from './shared';
import {
  DelegatorBackButton,
  DelegatorHome,
  DelegatorSetupForm,
  DelegatorSetups,
} from './survey-delegator';
import { SurveyDelegatorGate } from './surveys-provider';

type SurveysDelegatorPageProps = {
  operatorId?: string;
  setupId?: string;
};

export const SurveysDelegatorPage: FC<SurveysDelegatorPageProps> = ({
  operatorId,
  setupId,
}) => {
  // No operatorId means we're at the delegator home page (accessible to all)
  if (!operatorId) {
    return (
      <>
        <BackButton />
        <NoSSRWrapper>
          <DelegatorHome />
        </NoSSRWrapper>
      </>
    );
  }

  // operatorId but no setupId means we're viewing setups for an operator
  if (!setupId) {
    return (
      <>
        <SurveyDelegatorGate operatorId={operatorId}>
          <DelegatorBackButton />
          <DelegatorSetups operatorId={operatorId} />
        </SurveyDelegatorGate>
      </>
    );
  }

  // Both operatorId and setupId means we're editing/adding a setup
  return (
    <>
      <SurveyDelegatorGate operatorId={operatorId}>
        <DelegatorBackButton operatorId={operatorId} />
        <DelegatorSetupForm operatorId={operatorId} setupId={setupId} />
      </SurveyDelegatorGate>
    </>
  );
};
