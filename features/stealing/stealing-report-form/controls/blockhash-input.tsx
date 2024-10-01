import { FormTitle, Note } from 'shared/components';
import { TextInputHookForm } from 'shared/hook-form/controls';

export const BlockhashInput: React.FC = () => {
  return (
    <>
      <FormTitle>Enter BlockHash</FormTitle>
      <TextInputHookForm fieldName="blockhash" label="Block Hash" />
      <Note>
        Execution layer block hash of the proposed block with EL rewards
        stealing
      </Note>
    </>
  );
};
