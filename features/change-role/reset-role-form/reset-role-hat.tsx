import { ColoredHat, HatBalance, HatRow } from 'shared/hat';
import { useAccount } from 'shared/hooks';
import { AddressBadge } from 'shared/wallet';
import { useResetRoleFormData } from './context';

export const ResetRoleHat = () => {
  const { address } = useAccount();
  const { currentAddress, loading } = useResetRoleFormData();

  return (
    <ColoredHat>
      <HatRow>
        <HatBalance
          title="Current manager address"
          small
          loading={loading.isInfoLoading}
          value={<AddressBadge address={currentAddress} />}
        />
        <HatBalance
          title="Current rewards address"
          small
          loading={loading.isInfoLoading}
          value={<AddressBadge address={address} />}
        />
      </HatRow>
    </ColoredHat>
  );
};
