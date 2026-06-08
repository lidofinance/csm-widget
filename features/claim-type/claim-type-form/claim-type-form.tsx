import { FC, memo } from 'react';

import { FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { ClaimTypeFormInfo } from './claim-type-form-info';
import { ClaimTypeFormLoader } from './claim-type-form-loader';
import { ClaimTypeDataProvider, ClaimTypeFormProvider } from './context';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';

export const ClaimTypeForm: FC = memo(() => {
  return (
    <ClaimTypeDataProvider>
      <ClaimTypeFormProvider>
        <FormBlock>
          <ClaimTypeFormLoader>
            <Form>
              <Info />
              <SubmitButton />
            </Form>
            <ClaimTypeFormInfo />
          </ClaimTypeFormLoader>
        </FormBlock>
      </ClaimTypeFormProvider>
    </ClaimTypeDataProvider>
  );
});
