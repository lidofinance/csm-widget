import { PATH } from 'consts/urls';
import { FC, memo } from 'react';
import { BackButton, FormBlock } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { SplitsDataProvider, SplitsFormProvider } from './context';
import { EditInfo } from './controls/edit-info';
import { EditSplits } from './controls/edit-splits';
import { SubmitButton } from './controls/submit-button';
import { SplitsFormLoader } from './splits-form-loader';

export const SplitsForm: FC = memo(() => {
  return (
    <SplitsDataProvider>
      <FormBlock data-testid="splitsForm">
        <BackButton text="Back to all roles" href={PATH.SETTINGS} />
        <SplitsFormProvider>
          <SplitsFormLoader>
            <Form>
              <EditInfo />
              <EditSplits />
              <SubmitButton />
            </Form>
          </SplitsFormLoader>
        </SplitsFormProvider>
      </FormBlock>
    </SplitsDataProvider>
  );
});
