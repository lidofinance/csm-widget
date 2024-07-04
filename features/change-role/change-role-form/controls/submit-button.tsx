import { SubmitButtonHookForm } from 'shared/hook-form/controls/submit-button-hook-form';
import { useRole } from '../hooks/useRole';
import { Note } from 'shared/components';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { ChangeRoleFormInputType } from '../context';

export const SubmitButton = () => {
  const role = useRole();
  const { setValue } = useFormContext<ChangeRoleFormInputType>();

  const clickHandle = useCallback(() => {
    setValue('isRevoke', false);
  }, [setValue]);

  return (
    <>
      <SubmitButtonHookForm
        disabled={false}
        errorField="address"
        onClick={clickHandle}
      >
        Propose a new {role} address
      </SubmitButtonHookForm>
      <Note text="To complete the address change, the owner of the new address must confirm the change" />
    </>
  );
};
