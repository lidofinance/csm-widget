import { FC, memo } from 'react';
import { FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { EjectKeysDataProvider, EjectKeysFormProvider } from './context';
import { AmountInput } from './controls/amount-input';
import { KeysSelector } from './controls/keys-selector';
import { SubmitButton } from './controls/submit-button';
import { EjectKeysFormInfo } from './eject-keys-form-info';
import { EjectKeysFormLoader } from './eject-keys-form-loader';

export const EjectKeysForm: FC = memo(() => {
  return (
    <EjectKeysDataProvider>
      <EjectKeysFormProvider>
        <FormBlock>
          <EjectKeysFormLoader>
            <Form>
              <KeysSelector />
              <AmountInput />
              <SubmitButton />
            </Form>
            <EjectKeysFormInfo />
          </EjectKeysFormLoader>
        </FormBlock>
      </EjectKeysFormProvider>
    </EjectKeysDataProvider>
  );
});
