import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Note } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ChangeRoleFormInputType, useChangeRoleFormData } from '../context';
import { useRole } from '../hooks/use-role';

export const SubmitButton = () => {
  const role = useRole();
  const { isPropose, isManagerReset } = useChangeRoleFormData(true);
  const { setValue } = useFormContext<ChangeRoleFormInputType>();

  const clickHandle = useCallback(() => {
    setValue('isRevoke', false);
  }, [setValue]);

  const title = isManagerReset
    ? `Reset ${role} address`
    : isPropose
      ? `Propose a new ${role} address`
      : `Change ${role} address`;

  return (
    <>
      <SubmitButtonHookForm errorField="address" onClick={clickHandle}>
        {title}
      </SubmitButtonHookForm>
      {isPropose && (
        <Note>
          To complete the address change, the owner of the new address must
          confirm the change
        </Note>
      )}
    </>
  );
};
