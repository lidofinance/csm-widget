import { AddressZero } from '@ethersproject/constants';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { ColoredHat, HatBalance, HatRow } from 'shared/hat';
import { AddressBadge } from 'shared/wallet';
import { ChangeRoleFormInputType, useChangeRoleFormData } from './context';

export const ChangeRoleHat = () => {
  const { proposedAddress, currentAddress, loading } = useChangeRoleFormData();

  const isProposedAddress = useMemo(
    () => proposedAddress !== AddressZero,
    [proposedAddress],
  );

  const role = useWatch<ChangeRoleFormInputType, 'role'>({ name: 'role' });
  const roleTitle = useMemo(() => role.toLowerCase(), [role]);

  return (
    <ColoredHat>
      <HatRow>
        <HatBalance
          title="Status"
          small
          loading={loading.isInfoLoading}
          value={isProposedAddress ? 'Pending change' : 'No change proposed'}
        />
        <HatBalance
          title={`Current ${roleTitle} address`}
          small
          loading={loading.isInfoLoading}
          value={<AddressBadge address={currentAddress} />}
        />
      </HatRow>
      {isProposedAddress && (
        <HatRow>
          (
          <HatBalance
            title={`Proposed ${roleTitle} address`}
            small
            loading={loading.isInfoLoading}
            value={<AddressBadge address={proposedAddress} />}
          />
          )
        </HatRow>
      )}
    </ColoredHat>
  );
};
