import { ColoredHat, HatAccount, HatBalance, HatRow } from 'shared/hat';
import { useAccount } from 'shared/hooks';
import { useAcceptInviteFormData } from './context';

export const AcceptInviteHat = () => {
  const { address } = useAccount();
  const {
    invites,
    loading: { isInvitesLoading },
  } = useAcceptInviteFormData();

  return (
    <ColoredHat>
      <HatRow>
        <HatBalance
          title="Invites count"
          small
          loading={isInvitesLoading}
          value={invites?.length ?? 0}
        />
        <HatAccount address={address} />
      </HatRow>
    </ColoredHat>
  );
};
