import { FC, memo } from 'react';
import { FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { RemoveKeysDataProvider, RemoveKeysFormProvider } from './context';
import { AmountInput } from './controls/amount-input';
import { KeysSelector } from './controls/keys-selector';
import { SubmitButton } from './controls/submit-button';
import { RemoveKeysFormInfo } from './remove-keys-form-info';
import { RemoveKeysFormLoader } from './remove-keys-form-loader';

export const RemoveKeysForm: FC = memo(() => {
  return (
    <RemoveKeysDataProvider>
      <RemoveKeysFormProvider>
        <FormBlock data-testid="removeKeysForm">
          <RemoveKeysFormLoader>
            <Form>
              <KeysSelector />
              <AmountInput />
              <SubmitButton />
            </Form>
            <RemoveKeysFormInfo />
          </RemoveKeysFormLoader>
        </FormBlock>
      </RemoveKeysFormProvider>
    </RemoveKeysDataProvider>
  );
});
