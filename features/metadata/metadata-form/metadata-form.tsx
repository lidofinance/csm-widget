import { FC, memo } from 'react';
import { FormCard, FormPage, FormReady, SubmitButton } from 'shared/form-page';
import { TextField } from 'shared/hook-form/fields';
import { Form } from 'shared/hook-form/form-controller';
import { AppFormUi } from 'shared/hook-form/form-ui';
import { MetadataDataProvider, MetadataFormProvider } from './context';
import { MetadataFormGate } from './metadata-form-gate';

export const MetadataForm: FC = memo(() => (
  <AppFormUi>
    <MetadataDataProvider>
      <MetadataFormProvider>
        <FormPage>
          <FormReady>
            <MetadataFormGate>
              <Form data-testid="metadataForm">
                <FormCard title="Node Operator name">
                  <TextField
                    name="name"
                    label="Name"
                    placeholder="Enter operator name"
                  />
                  <TextField
                    name="description"
                    label="Description"
                    placeholder="Enter operator description"
                  />
                  <SubmitButton>Save</SubmitButton>
                </FormCard>
              </Form>
            </MetadataFormGate>
          </FormReady>
        </FormPage>
      </MetadataFormProvider>
    </MetadataDataProvider>
  </AppFormUi>
));
