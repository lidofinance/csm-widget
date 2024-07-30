import { FC } from 'react';
import { FormTitle, Note } from 'shared/components';
import { FormOptional } from './form-optional';
import { ManagerAddressInput } from './manager-address-input';
import { RewardsAddressInput } from './rewards-address-input';
import { RewardsAddressTypeSelect } from './rewards-address-type-select';

export const CustomAddressesSection: FC = () => {
  return (
    <FormOptional
      fieldName="specifyCustomAddresses"
      titles={['Specify custom addresses', 'Do not specify custom addresses']}
    >
      <FormTitle>Specify custom addresses</FormTitle>
      <Note type="warning">
        Setting custom addresses for the Node Operator is{' '}
        <b>at your own risk</b>. In case of wrong addresses specified, you can
        lose the access to your Node Operator and your bond submitted and
        rewards acquired.
      </Note>
      <RewardsAddressInput />
      <ManagerAddressInput />
      <FormTitle>Select the rewards address type</FormTitle>
      <Note type="warning">
        Rewards address type can be selected only once upon the Node Operator
        creation and <b>cannot be changed</b> in future.
      </Note>
      <RewardsAddressTypeSelect />
    </FormOptional>
  );
};
