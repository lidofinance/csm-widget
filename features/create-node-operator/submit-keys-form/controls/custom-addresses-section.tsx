import { FC } from 'react';
import { FormTitle, WarningBlock } from 'shared/components';
import { ManagerAddressInput } from './manager-address-input';
import { RewardsAddressInput } from './rewards-address-input';
import { RewardsAddressTypeSelect } from './rewards-address-type-select';
import { Link } from '@lidofinance/lido-ui';
import { OptionalSectionHookForm } from 'shared/hook-form/controls';

export const CustomAddressesSection: FC = () => {
  return (
    <OptionalSectionHookForm
      fieldName="specifyCustomAddresses"
      titles={['Specify custom addresses', 'Do not specify custom addresses']}
    >
      <FormTitle>Specify custom addresses</FormTitle>
      <WarningBlock>
        Setting custom addresses for the Node Operator is{' '}
        <b>at your own risk</b>. In the case that an incorrect or incompatible
        address is specified, it may be possible that you permanently lose
        access to your Node Operator, bond, and potential rewards. Please check
        the{' '}
        <Link href="https://docs.lido.fi/staking-modules/csm/guides/addresses/#setting-custom-addresses-upon-node-operator-creation">
          detailed description of this feature
        </Link>{' '}
        before you proceed with setting the custom addresses.
      </WarningBlock>
      <RewardsAddressInput />
      <ManagerAddressInput />
      <FormTitle>Select the manager address permissions type</FormTitle>
      <WarningBlock>
        This permissions option can only be set once during Node Operator
        creation.
        <br />
        It can not be changed later on. Please check{' '}
        <Link href="https://docs.lido.fi/staking-modules/csm/guides/addresses/#extended-manager-address-permissions">
          the detailed explanation of the options
        </Link>{' '}
        to understand which option works best for your purposes.
      </WarningBlock>
      <RewardsAddressTypeSelect />
    </OptionalSectionHookForm>
  );
};
