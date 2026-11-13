import { Button, Card, IconRotate } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { StretchStack } from 'shared/components';
import type { MemberDto } from 'modules/surveys-sdk/generated';
import { useMembersModalStages } from '../hooks/use-members-modal-stages';
import { useSubmitRotation } from '../hooks/use-submit-rotation';
import { buildCancelPatch } from '../utils/rotation';
import type { MemberCardState } from '../utils/member-state';
import { MemberSummary } from './member-summary';
import { PendingRotation } from './pending-rotation';

type MemberCardProps = {
  index: number;
  member: MemberDto;
  state: MemberCardState;
  canManage: boolean;
  onRotate: () => void;
};

export const MemberCard: FC<MemberCardProps> = ({
  index,
  member,
  state,
  canManage,
  onRotate,
}) => {
  const stages = useMembersModalStages();
  const submit = useSubmitRotation();

  const onCancelPending = async () => {
    try {
      stages.pending();
      await submit.mutateAsync(buildCancelPatch(index));
      stages.success();
    } catch (error) {
      stages.failed(error);
    }
  };

  const rotate = canManage ? (
    <Button
      size="small"
      variant="outline"
      iconLeft={<IconRotate />}
      onClick={onRotate}
      dataTestId={{ root: `rotateButton${index}` }}
    >
      Rotate
    </Button>
  ) : undefined;

  const cancel =
    canManage && state.kind === 'pending' ? (
      <Button
        size="small"
        variant="error"
        loading={submit.isPending}
        onClick={() => void onCancelPending()}
        dataTestId={{ root: `cancelRotationButton${index}` }}
      >
        Cancel rotation
      </Button>
    ) : undefined;

  return (
    <Card data-testid={`memberCard${index}`}>
      <StretchStack gap={16}>
        <MemberSummary
          title={`Cluster member #${index + 1}`}
          member={member}
          action={rotate}
        />

        {(state.kind === 'pending' || state.kind === 'rejected') && (
          <PendingRotation
            title={`New cluster member #${index + 1}`}
            proposed={state.proposed}
            action={cancel}
            rejected={
              state.kind === 'rejected'
                ? { comment: state.comment, reason: state.reason }
                : undefined
            }
          />
        )}
      </StretchStack>
    </Card>
  );
};
