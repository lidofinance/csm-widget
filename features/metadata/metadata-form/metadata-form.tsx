import { FC, memo } from 'react';

import { FormBlock, FormTitle } from 'shared/components';
import { Form } from 'shared/hook-form/form-controller';
import { MetadataDataProvider, MetadataFormProvider } from './context';
import { DescriptionInput } from './controls/description-input';
import { NameInput } from './controls/name-input';
import { SubmitButton } from './controls/submit-button';
import { MetadataFormLoader } from './metadata-form-loader';

export const MetadataForm: FC = memo(() => {
  return (
    <MetadataDataProvider>
      <MetadataFormProvider>
        <FormBlock>
          <MetadataFormLoader>
            <Form>
              <FormTitle>Node Operator name</FormTitle>
              <NameInput />
              <DescriptionInput />
              <SubmitButton />
            </Form>
          </MetadataFormLoader>
        </FormBlock>
      </MetadataFormProvider>
    </MetadataDataProvider>
  );
});
