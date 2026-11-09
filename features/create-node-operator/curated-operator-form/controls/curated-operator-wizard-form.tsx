import { FormLayout, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useFormWizard } from 'shared/form-page';
import { Form } from 'shared/hook-form/form-controller';
import { CURATED_OPERATOR_STEPS } from '../curated-operator-wizard';
import { AddressesStep } from './addresses-step';
import { CuratedOperatorAside } from './curated-operator-aside';
import { GateSelector } from './gate-selector';
import { OperatorInfoStep } from './operator-info-step';
import { VerificationSummary } from './verification-summary';

const STEP_CONTENT: FC[] = [
  GateSelector,
  AddressesStep,
  OperatorInfoStep,
  VerificationSummary,
];

export const CuratedOperatorWizardForm: FC = () => {
  const { step, onKeyDown } = useFormWizard(CURATED_OPERATOR_STEPS);
  const StepContent = STEP_CONTENT[step] ?? GateSelector;

  return (
    <Form data-testid="curatedOperatorForm" onKeyDown={onKeyDown}>
      <FormLayout aside={<CuratedOperatorAside />}>
        <Stack gap={24}>
          <StepContent />
        </Stack>
      </FormLayout>
    </Form>
  );
};
