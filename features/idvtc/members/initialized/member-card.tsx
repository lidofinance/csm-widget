import { Button, ButtonIcon } from '@lidofinance/lido-ui';
import { ReactComponent as RotateIcon } from 'assets/icons/rotate.svg';
import { FC } from 'react';
import { Stack } from 'shared/components';
import type { MemberDto } from 'modules/surveys-sdk/generated';
import { ClusterMemberCard } from '../../shared';
import { useMembersModalStages } from '../hooks/use-members-modal-stages';
import { useSubmitRotation } from '../hooks/use-submit-rotation';
import { RotationForm } from '../rotation/rotation-form';
import { buildCancelPatch } from '../utils/rotation';
import type { MemberCardState } from '../utils/member-state';
import { MemberSummary } from './member-summary';
import { PendingRotation } from './pending-rotation';

type MemberCardProps = {
  index: number;
  member: MemberDto;
  state: MemberCardState;
  // Another card is being edited — dim this one and disable its actions.
  dimmed: boolean;
  canManage: boolean;
  takenAddresses: string[];
  onRotate: () => void;
  // Editing finished: header Cancel (discard) or successful submit.
  onDone: () => void;
};

export const MemberCard: FC<MemberCardProps> = ({
  index,
  member,
  state,
  dimmed,
  canManage,
  takenAddresses,
  onRotate,
  onDone,
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

  const action = !canManage ? undefined : state.kind === 'editing' ? (
    <Button
      size="xs"
      variant="outlined"
      color="error"
      onClick={onDone}
      data-testid={`cancelRotationButton${index}`}
    >
      Cancel
    </Button>
  ) : state.kind === 'pending' ? (
    <Button
      size="xs"
      variant="outlined"
      color="error"
      loading={submit.isPending}
      onClick={() => void onCancelPending()}
      data-testid={`cancelRotationButton${index}`}
    >
      Cancel rotation
    </Button>
  ) : (
    <ButtonIcon
      icon={<RotateIcon />}
      size="xs"
      variant="outlined"
      onClick={onRotate}
      data-testid={`rotateButton${index}`}
    >
      Rotate
    </ButtonIcon>
  );

  return (
    <ClusterMemberCard $dimmed={dimmed} data-testid={`memberCard${index}`}>
      <Stack direction="column" gap="md">
        <MemberSummary index={index} member={member} action={action} />

        {state.kind === 'editing' && (
          <RotationForm
            index={index}
            currentAddress={member.address}
            takenAddresses={takenAddresses}
            onDone={onDone}
          />
        )}

        {(state.kind === 'pending' || state.kind === 'rejected') && (
          <PendingRotation
            title={`New cluster member address #${index + 1}`}
            proposed={state.proposed}
            rejected={
              state.kind === 'rejected'
                ? { comment: state.comment, reason: state.reason }
                : undefined
            }
          />
        )}
      </Stack>
    </ClusterMemberCard>
  );
};
