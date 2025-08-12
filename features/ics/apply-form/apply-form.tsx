import { FC, memo } from 'react';

import { ApplyFormProvider } from './context';

import { FormBlock } from 'shared/components';
import {
  BaseFormLoader,
  FormControllerStyled,
} from 'shared/hook-form/form-controller';
import { ApplyFormInfo } from './apply-form-info';
import {
  MainAddressInput,
  AdditionalAddresses,
  SocialProof,
  SubmitButton,
} from './controls';

export const ApplyForm: FC = memo(() => {
  return (
    <ApplyFormProvider>
      <FormBlock>
        <BaseFormLoader>
          <FormControllerStyled>
            <MainAddressInput />
            <AdditionalAddresses />
            <SocialProof />
            <SubmitButton />
          </FormControllerStyled>
          <ApplyFormInfo />
        </BaseFormLoader>
      </FormBlock>
    </ApplyFormProvider>
  );
});