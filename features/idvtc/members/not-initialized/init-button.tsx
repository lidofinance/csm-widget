import { Body, Button, Card } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { StretchStack } from 'shared/components';
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
      <StretchStack gap={16}>
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
      </StretchStack>
    </Card>
  );
};
