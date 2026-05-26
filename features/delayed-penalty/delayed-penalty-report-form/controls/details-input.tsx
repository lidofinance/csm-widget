import { FormTitle } from 'shared/components';
import { TextInputHookForm } from 'shared/hook-form/controls';

export const DetailsInput: React.FC = () => {
  return (
    <>
      <FormTitle>Enter Details</FormTitle>
      <TextInputHookForm fieldName="details" label="Details" />
    </>
  );
};
