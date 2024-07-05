import { FC, memo } from 'react';
import { RemoveKeysFormProvider } from './context';
import { KeysSelector } from './controls/keys-selector';
import { SubmitButton } from './controls/submit-button';
import { FormLoading } from './form-loading';
import { RemoveKeysFormInfo } from './remove-keys-form-info';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';

export const RemoveKeysForm: FC = memo(() => {
  return (
    <RemoveKeysFormProvider>
      <FormBlock>
        <FormLoading>
          <FormControllerStyled>
            <KeysSelector />
            <SubmitButton />
          </FormControllerStyled>
          <RemoveKeysFormInfo />
        </FormLoading>
      </FormBlock>
    </RemoveKeysFormProvider>
  );
});
