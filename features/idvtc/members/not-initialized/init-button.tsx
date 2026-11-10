import { Body, Button, Card, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useInitMembers } from '../hooks/use-init-members';
import { useMembersModalStages } from '../hooks/use-members-modal-stages';

export const InitButton: FC = () => {
  const init = useInitMembers();
  const stages = useMembersModalStages();

  const onInit = async () => {
    try {
      stages.pending();
      await init.mutateAsync();
      stages.success();
    } catch (error) {
      stages.failed(error);
    }
  };

  return (
    <Card data-testid="initMembers">
      <Stack gap={16}>
        <Body>
          Initialize your cluster members from your approved application
        </Body>
        <Button
          fullWidth
          onClick={onInit}
          loading={init.isPending}
          dataTestId={{ root: 'initMembersButton' }}
        >
          Initialize cluster members
        </Button>
      </Stack>
    </Card>
  );
};
