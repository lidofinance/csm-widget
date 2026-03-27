import { type FC, memo } from 'react';
import { FormBlock, Stack } from 'shared/components';
import { Form, FormLoader } from 'shared/hook-form/form-controller';
import { CuratedOperatorDataProvider } from './context/curated-operator-data-provider';
import { CuratedOperatorFormProvider } from './context/curated-operator-form-provider';
import { StepTrack } from './controls/step-track';
import { Step1 } from './controls/steps/step-1';
import { Step2 } from './controls/steps/step-2';
import { Step3 } from './controls/steps/step-3';
import { Step4 } from './controls/steps/step-4';
import { CuratedOperatorFormInfo } from './curated-operator-form-info';

export const CuratedOperatorForm: FC = memo(() => (
  <CuratedOperatorDataProvider>
    <CuratedOperatorFormProvider>
      <FormBlock data-testid="curatedOperatorForm">
        <FormLoader>
          <Form>
            <Stack direction="column" gap="sm">
              <StepTrack />
              <Step1 />
              <Step2 />
              <Step3 />
              <Step4 />
            </Stack>
          </Form>
          <CuratedOperatorFormInfo />
        </FormLoader>
      </FormBlock>
    </CuratedOperatorFormProvider>
  </CuratedOperatorDataProvider>
));
