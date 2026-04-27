import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Note } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { type ChangeRoleFormInputType, useChangeRoleFlow } from '../context';
import { useRole } from '../hooks/use-role';

export const SubmitButton = () => {
  const role = useRole();
  const flow = useChangeRoleFlow();
  const { setValue } = useFormContext<ChangeRoleFormInputType>();

  // TODO: move this to somethere ?
  const clickHandle = useCallback(() => {
    setValue('intent', 'submit');
  }, [setValue]);

  const title =
    flow.action === 'manager-reset'
      ? `Reset ${role} Address`
      : flow.action === 'propose'
        ? `Propose a new ${role} Address`
        : `Change ${role} Address`;

  return (
    <>
      <SubmitButtonHookForm disableIfClean onClick={clickHandle}>
        {title}
      </SubmitButtonHookForm>
      {flow.action === 'propose' && (
        <Note>
          To complete the address change, the owner of the new address must
          confirm the change
        </Note>
      )}
    </>
  );
};
