import { Button, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { FormBlock } from 'shared/components';
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
    <FormBlock $gap="lg" data-testid="initMembers">
      <Text size="sm">
        Initialize your cluster members from your approved application
      </Text>
      <Button
        onClick={onInit}
        loading={init.isPending}
        fullwidth
        data-testid="initMembersButton"
      >
        Initialize cluster members
      </Button>
    </FormBlock>
  );
};
