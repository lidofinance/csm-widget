import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Latice, TitledAddress, Warning } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { ChangeRoleFormInputType, useChangeRoleFormData } from '../context';
import { useRole } from '../hooks/use-role';

export const Info: FC = () => {
  const role = useRole();
  const { currentAddress, proposedAddress, isPropose } =
    useChangeRoleFormData();
  const { setValue } = useFormContext<ChangeRoleFormInputType>();

  const revokeHandle = useCallback(() => {
    setValue('isRevoke', true);
  }, [setValue]);

  return (
    <>
      <Latice variant="secondary">
        <TitledAddress
          title={`Current ${role} address`}
          address={currentAddress}
        />
        <TitledAddress
          title={
            <>
              <Warning text="Pending change" />
              {isPropose && (
                <SubmitButtonHookForm
                  variant="outlined"
                  size="xs"
                  fullwidth={false}
                  onClick={revokeHandle}
                >
                  Revoke
                </SubmitButtonHookForm>
              )}
            </>
          }
          address={proposedAddress}
        />
      </Latice>
    </>
  );
};
