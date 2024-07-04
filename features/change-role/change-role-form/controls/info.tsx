import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Latice, TitledAddress, Warning } from 'shared/components';
import { SubmitButtonHookForm } from 'shared/hook-form/controls/submit-button-hook-form';
import { ChangeRoleFormInputType, useChangeRoleFormData } from '../context';
import { useRole } from '../hooks/useRole';

export const Info: FC = () => {
  const role = useRole();
  const { currentAddress, proposedAddress } = useChangeRoleFormData();
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
              <SubmitButtonHookForm
                variant="outlined"
                size="xs"
                fullwidth={false}
                onClick={revokeHandle}
              >
                Revoke
              </SubmitButtonHookForm>
            </>
          }
          address={proposedAddress}
        />
      </Latice>
    </>
  );
};
