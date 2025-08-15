import { FC, memo } from 'react';
import { FormBlock } from 'shared/components';
import { FormControllerStyled } from 'shared/hook-form/form-controller';
import { ApplyFormProvider } from './context';
import {
  AdditionalAddresses,
  MainAddress,
  SocialProof,
  SubmitButton,
} from './controls';

export const ApplyForm: FC = memo(() => {
  return (
    <ApplyFormProvider>
      <FormBlock>
        <FormControllerStyled $gap="xxl">
          <MainAddress />
          <AdditionalAddresses />
          <SocialProof />
          <SubmitButton />
        </FormControllerStyled>
      </FormBlock>
    </ApplyFormProvider>
  );
});
