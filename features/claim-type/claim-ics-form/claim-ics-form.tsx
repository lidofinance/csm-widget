import { FC, memo } from 'react';

import { FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { ClaimIcsFormInfo } from './claim-ics-form-info';
import { ClaimIcsFormLoader } from './claim-ics-form-loader';
import { ClaimIcsDataProvider, ClaimIcsFormProvider } from './context';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';

export const ClaimIcsForm: FC = memo(() => {
  return (
    <ClaimIcsDataProvider>
      <ClaimIcsFormProvider>
        <FormBlock>
          <ClaimIcsFormLoader>
            <Form>
              <Info />
              <SubmitButton />
            </Form>
            <ClaimIcsFormInfo />
          </ClaimIcsFormLoader>
        </FormBlock>
      </ClaimIcsFormProvider>
    </ClaimIcsDataProvider>
  );
});
