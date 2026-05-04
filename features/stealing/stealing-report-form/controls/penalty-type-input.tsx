import { FormTitle } from 'shared/components';
import { TextInputHookForm } from 'shared/hook-form/controls';

export const PenaltyTypeInput: React.FC = () => {
  return (
    <>
      <FormTitle>Enter Penalty Type</FormTitle>
      <TextInputHookForm fieldName="penaltyType" label="Penalty Type" />
    </>
  );
};
