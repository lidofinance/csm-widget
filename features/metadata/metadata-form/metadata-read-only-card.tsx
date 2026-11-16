import { Input, MessageBox, Textarea } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import { FormCard } from 'shared/form-page';

const EMPTY_VALUE = '—';

export const MetadataRestrictedNotice: FC = () => (
  <MessageBox variant="warning" headline="Editing is currently disabled.">
    Contact the NOM team or CMC for assistance
  </MessageBox>
);

export type MetadataReadOnlyCardProps = {
  name?: string;
  description?: string;
  notice: ReactNode;
};

export const MetadataReadOnlyCard: FC<MetadataReadOnlyCardProps> = ({
  name,
  description,
  notice,
}) => (
  <FormCard data-testid="metadataForm">
    {notice}
    <Input label="Name" value={name || EMPTY_VALUE} disabled readOnly />
    <Textarea
      autosize
      rows={3}
      label="Description"
      value={description || EMPTY_VALUE}
      disabled
      readOnly
    />
  </FormCard>
);
