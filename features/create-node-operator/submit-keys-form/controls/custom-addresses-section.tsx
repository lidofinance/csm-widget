import { MessageBox, SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { EXTENDED_MODE_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { DisclosureField } from 'shared/hook-form/fields';
import { ManagerAddressInput } from './manager-address-input';
import { RewardsAddressInput } from './rewards-address-input';
import { RewardsAddressTypeSelect } from './rewards-address-type-select';

export const CustomAddressesSection: FC = () => (
  <DisclosureField
    name="specifyCustomAddresses"
    label="Specify custom addresses"
    openLabel="Do not specify custom addresses"
    dependentFields={['rewardsAddress', 'managerAddress']}
  >
    <Stack direction="column" gap={16} align="stretch">
      <SectionTitle title="Specify custom addresses" />
      <MessageBox variant="warning">
        <b>
          Setting custom addresses for the Node Operator is at your own risk.
        </b>
        <br />
        In the case that an incorrect or incompatible address is specified, it
        may be possible that you permanently lose access to your Node Operator,
        bond, and potential rewards. Please check the{' '}
        <MatomoLink
          $inline
          href={EXTENDED_MODE_LINK}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.customAddressDescription}
        >
          detailed description of this feature
        </MatomoLink>{' '}
        before you proceed with setting the custom addresses.
      </MessageBox>
      <RewardsAddressInput />
      <ManagerAddressInput />
      <SectionTitle title="Select the Manager Address permissions type" />
      <MessageBox variant="warning">
        <b>
          This permissions option can only be set once during Node Operator
          creation.
        </b>
        <br />
        It can not be changed later on. Please check the{' '}
        <MatomoLink
          $inline
          href={EXTENDED_MODE_LINK}
          matomoEvent={
            MATOMO_CLICK_EVENTS_TYPES.managerAddressPermissionTypeDescription
          }
        >
          detailed explanation of the options
        </MatomoLink>{' '}
        to understand which option works best for your purposes.
      </MessageBox>
      <RewardsAddressTypeSelect />
    </Stack>
  </DisclosureField>
);
