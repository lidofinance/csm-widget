import { FC } from 'react';
import { TextInputHookForm } from 'shared/hook-form/controls';

export const NameInput: FC = () => {
  return (
    <TextInputHookForm
      fieldName="name"
      label="Name"
      placeholder="Enter operator name"
    />
  );
};
