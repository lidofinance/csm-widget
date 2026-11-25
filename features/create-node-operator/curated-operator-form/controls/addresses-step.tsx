import { ROLES } from '@lidofinance/lido-csm-sdk';
import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { OwnerChip, RoleActionsList } from 'shared/components';
import { AddressField } from 'shared/hook-form/fields';
import { useCuratedOperatorFormData } from '../context';

export const AddressesStep: FC = () => {
  const { address } = useCuratedOperatorFormData(true);

  return (
    <>
      <AddressField
        name="managerAddress"
        label={
          <>
            Manager Address <OwnerChip />
          </>
        }
        tooltip={
          <RoleActionsList role={ROLES.MANAGER} extendedManagerPermissions />
        }
        description="Has the ultimate control over the Node Operator. Must be a multisig."
        currentAddress={address}
        showUntouched
      />
      <AddressField
        name="rewardAddress"
        label="Rewards Address"
        tooltip={
          <RoleActionsList role={ROLES.REWARDS} extendedManagerPermissions />
        }
        description="Used for receiving rewards. Must be a multisig or smart contract address."
        currentAddress={address}
        showUntouched
      />
      <MessageBox headline="Setting addresses for the Node Operator is at your own risk.">
        If you specify an incorrect or incompatible address, you may permanently
        lose access to your Node Operator, bond, and potential rewards
      </MessageBox>
    </>
  );
};
