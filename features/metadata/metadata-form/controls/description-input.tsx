import { FC } from 'react';
import { TextInputHookForm } from 'shared/hook-form/controls';

export const DescriptionInput: FC = () => {
  return (
    <TextInputHookForm
      fieldName="description"
      label="Description"
      placeholder="Enter operator description"
    />
  );
};
