import { FC, memo } from 'react';

import { PATH } from 'consts/urls';
import { BackButton, FormBlock } from 'shared/components';
import { Form, FormLoader } from 'shared/hook-form/form-controller';
import { OperatorInfoDataProvider, OperatorInfoFormProvider } from './context';
import { DescriptionInput } from './controls/description-input';
import { NameInput } from './controls/name-input';
import { SubmitButton } from './controls/submit-button';

export const OperatorInfoForm: FC = memo(() => {
  return (
    <OperatorInfoDataProvider>
      <OperatorInfoFormProvider>
        <FormBlock>
          <BackButton text="Back to all roles" href={PATH.ROLES} />
          <FormLoader>
            <Form>
              <NameInput />
              <DescriptionInput />
              <SubmitButton />
            </Form>
          </FormLoader>
        </FormBlock>
      </OperatorInfoFormProvider>
    </OperatorInfoDataProvider>
  );
});
