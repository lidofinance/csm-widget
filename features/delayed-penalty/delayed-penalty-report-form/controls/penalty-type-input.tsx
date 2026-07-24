import { FormTitle } from 'shared/components';
import { NumberInputHookForm } from 'shared/hook-form/controls';

export const PenaltyTypeInput: React.FC = () => {
  return (
    <>
      <FormTitle>Enter Penalty Type</FormTitle>
      <NumberInputHookForm fieldName="penaltyType" label="Penalty Type" />
    </>
  );
};
