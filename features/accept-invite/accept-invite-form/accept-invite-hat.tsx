import { useNodeOperator } from 'providers/node-operator-provider';
import { ColoredHat, HatAccount, HatBalance, HatRow } from 'shared/hat';
import { useAccount } from 'shared/hooks';

export const AcceptInviteHat = () => {
  const { address } = useAccount();
  const { invites, isInvitesLoading } = useNodeOperator();

  return (
    <ColoredHat>
      <HatRow>
        <HatBalance
          title="Invites count"
          small
          loading={isInvitesLoading}
          value={invites.length}
        />
        <HatAccount address={address} />
      </HatRow>
    </ColoredHat>
  );
};
