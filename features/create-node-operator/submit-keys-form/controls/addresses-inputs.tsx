import { FC } from 'react';
import { RewardsAddressInput } from './rewards-address-input';
import { ManagerAddressInput } from './manager-address-input';
import { Note } from 'shared/components';

export const AddressesInputs: FC = () => (
  <>
    <RewardsAddressInput />
    <ManagerAddressInput />
    <Note>
      Keep these addresses inputs empty to use connected wallet as
      rewards/manager address
    </Note>
  </>
);
