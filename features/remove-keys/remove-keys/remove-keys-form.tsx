import { FC, memo } from 'react';
import { RemoveKeysFormProvider } from './context';
import { KeysSelector } from './controls/keys-selector';
import { SubmitButton } from './controls/submit-button';
import { FormLoading } from './form-loading';
import { RemoveKeysFormInfo } from './remove-keys-form-info';
import { FormControllerStyled, RemoveKeysBlock } from './styles';

export const RemoveKeysForm: FC = memo(() => {
  return (
    <RemoveKeysFormProvider>
      <RemoveKeysBlock>
        <FormLoading>
          <FormControllerStyled>
            <KeysSelector />
            <SubmitButton />
          </FormControllerStyled>
          <RemoveKeysFormInfo />
        </FormLoading>
      </RemoveKeysBlock>
    </RemoveKeysFormProvider>
  );
});
