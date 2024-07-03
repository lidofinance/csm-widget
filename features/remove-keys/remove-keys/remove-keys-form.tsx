import { FC, memo } from 'react';
import { RemoveKeysFormProvider } from './context';
import { KeysSelector } from './controls/keys-selector';
import { SubmitButton } from './controls/submit-button';
import { RemoveKeysFormInfo } from './remove-keys-form-info';
import { RemoveKeysHat } from './remove-keys-hat';
import { FormControllerStyled, RemoveKeysBlock } from './styles';
import { FormLoading } from './form-loading';

export const RemoveKeysForm: FC = memo(() => {
  return (
    <RemoveKeysFormProvider>
      <RemoveKeysHat />
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
