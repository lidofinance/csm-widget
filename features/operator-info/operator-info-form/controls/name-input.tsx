import { FC } from 'react';
import { TextInputHookForm } from 'shared/hook-form/controls';

export const NameInput: FC = () => {
  return (
    <TextInputHookForm
      fieldName="name"
      label="Operator name"
      placeholder="Enter operator name"
    />
  );
};
