import { FC } from 'react';
import { TypeApplyGate } from 'shared/node-operator/type-status';
import { ApplyForm } from './apply-form';
import { FormStatus } from './form-status';
import { IcsProviders, useIcsState } from './shared';

const IcsApplyContent: FC = () => {
  const state = useIcsState();

  return (
    <TypeApplyGate
      program="ICS"
      state={state}
      formStatus={
        state.data && <FormStatus data={state.data} reset={state.reset} />
      }
      form={<ApplyForm />}
    />
  );
};

export const IcsApply: FC = () => (
  <IcsProviders>
    <IcsApplyContent />
  </IcsProviders>
);
