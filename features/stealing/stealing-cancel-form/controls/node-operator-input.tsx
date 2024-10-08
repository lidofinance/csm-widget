import { FormTitle } from 'shared/components';
import { TextInputHookForm } from 'shared/hook-form/controls';

export const NodeOperatorInput: React.FC = () => {
  return (
    <>
      <FormTitle>Specify Node Operator</FormTitle>
      <TextInputHookForm fieldName="nodeOperatorId" label="Node Operator ID" />
    </>
  );
};
