import { FC, memo } from 'react';

import { FormBlock } from 'shared/components';
import { Form, FormLoader } from 'shared/hook-form/form-controller';
import { MetadataDataProvider, MetadataFormProvider } from './context';
import { useMetadataFormData } from './context/metadata-data-provider';
import { DescriptionInput } from './controls/description-input';
import { NameInput } from './controls/name-input';
import { SubmitButton } from './controls/submit-button';
import { FormTitle } from './styles';

// TODO: view only mode for non-owners or if edit is restricted
export const MetadataForm: FC = memo(() => {
  return (
    <MetadataDataProvider>
      <MetadataFormProvider>
        <FormBlock>
          <FormLoader>
            <MetadataFormTitle />
            <Form>
              <NameInput />
              <DescriptionInput />
              <SubmitButton />
            </Form>
          </FormLoader>
        </FormBlock>
      </MetadataFormProvider>
    </MetadataDataProvider>
  );
});

const MetadataFormTitle: FC = () => {
  const { currentName } = useMetadataFormData(true);
  return <FormTitle>{currentName || 'Node Operator name'}</FormTitle>;
};
