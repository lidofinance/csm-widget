import { PATH } from 'consts/urls';
import { FC, memo, useCallback, useState } from 'react';
import { BackButton, FormBlock } from 'shared/components';
import { Form, FormLoader } from 'shared/hook-form/form-controller';
import { SplitsDataProvider, SplitsFormProvider } from './context';
import { EditSplits } from './controls/edit-splits';
import { PendingBanner } from './controls/pending-banner';
import { RewardsAddressView } from './controls/rewards-address';
import { SubmitButton } from './controls/submit-button';
import { ViewSplits } from './controls/view-splits';

export const SplitsForm: FC = memo(() => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = useCallback(() => setIsEditing(true), []);
  const handleCancel = useCallback(() => setIsEditing(false), []);

  return (
    <SplitsDataProvider>
      <FormBlock data-testid="splitsForm">
        <BackButton text="Back to all roles" href={PATH.SETTINGS} />
        <SplitsFormProvider>
          <FormLoader>
            <PendingBanner />
            {isEditing ? (
              <Form>
                <RewardsAddressView />
                <EditSplits />
                <SubmitButton onCancel={handleCancel} />
              </Form>
            ) : (
              <ViewSplits onEdit={handleEdit} />
            )}
          </FormLoader>
        </SplitsFormProvider>
      </FormBlock>
    </SplitsDataProvider>
  );
});
