import { Stack } from '@lidofinance/lido-app-ui';
import { FC, memo } from 'react';
import { FormCard, FormPage, FormReady, SubmitButton } from 'shared/form-page';
import { TextField } from 'shared/hook-form/fields';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { MetadataDataProvider, MetadataFormProvider } from './context';
import {
  METADATA_DESCRIPTION_MAX_LENGTH,
  METADATA_NAME_MAX_LENGTH,
} from './context/use-metadata-validation';
import { DescriptionField } from './description-field';
import { MetadataFormGate } from './metadata-form-gate';

export const MetadataForm: FC = memo(() => (
  <AppFormUi>
    <MetadataDataProvider>
      <MetadataFormProvider>
        <FormPage>
          <FormReady>
            <MetadataFormGate>
              <Form data-testid="metadataForm">
                <FormCard>
                  <Stack direction="column" gap={32}>
                    <TextField
                      name="name"
                      label="Name"
                      placeholder={`Node Operator name (up to ${METADATA_NAME_MAX_LENGTH} characters)`}
                    />
                    <DescriptionField
                      name="description"
                      label="Description"
                      placeholder={`Node Operator description (up to ${METADATA_DESCRIPTION_MAX_LENGTH} characters)`}
                    />
                    <SubmitButton>Update</SubmitButton>
                  </Stack>
                </FormCard>
              </Form>
            </MetadataFormGate>
          </FormReady>
        </FormPage>
      </MetadataFormProvider>
    </MetadataDataProvider>
  </AppFormUi>
));
