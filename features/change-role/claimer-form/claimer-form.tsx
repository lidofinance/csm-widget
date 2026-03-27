import { FC, memo } from 'react';

import { PATH } from 'consts/urls';
import { BackButton, FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { ClaimerFormLoader } from './claimer-form-loader';
import { ClaimerDataProvider, ClaimerFormProvider } from './context';
import { AddressInput } from './controls/address-input';
import { Info } from './controls/info';
import { SubmitButton } from './controls/submit-button';

export const ClaimerForm: FC = memo(() => {
  return (
    <ClaimerDataProvider>
      <ClaimerFormProvider>
        <FormBlock data-testid="claimerForm">
          <BackButton text="Back to all roles" href={PATH.SETTINGS} />
          <ClaimerFormLoader>
            <Form>
              <Info />
              <AddressInput />
              <SubmitButton />
            </Form>
          </ClaimerFormLoader>
        </FormBlock>
      </ClaimerFormProvider>
    </ClaimerDataProvider>
  );
});
