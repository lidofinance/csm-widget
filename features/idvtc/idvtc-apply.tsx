import { FC } from 'react';
import { TypeApplyGate } from 'shared/node-operator/type-status';
import { ApplyForm } from './apply-form';
import { FormStatus } from './form-status/form-status';
import { IdvtcProviders, useIdvtcState } from './shared';

const IdvtcApplyContent: FC = () => {
  const state = useIdvtcState();

  return (
    <TypeApplyGate
      program="IDVTC"
      state={state}
      formStatus={
        state.data && <FormStatus data={state.data} reset={state.reset} />
      }
      form={<ApplyForm />}
    />
  );
};

export const IdvtcApply: FC = () => (
  <IdvtcProviders>
    <IdvtcApplyContent />
  </IdvtcProviders>
);
