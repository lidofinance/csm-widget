import { Button, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import type { RotationRequestDto } from 'modules/surveys-sdk/generated';
import { ClusterMemberCard } from '../../shared';
import { useMembersModalStages } from '../hooks/use-members-modal-stages';
import { useSubmitRotation } from '../hooks/use-submit-rotation';
import { PendingRotation } from '../initialized/pending-rotation';
import { buildCancelAllPatch } from '../utils/rotation';

type InitRequestStatusProps = {
  request: RotationRequestDto;
  canManage: boolean;
  onNewRequest: () => void;
};

// From-scratch request status: no active members exist, so cards show only
// the proposed member. Per-slot cancel is forbidden for uninitialized
// operators (all-4-or-empty rule) — only a full cancel is offered.
export const InitRequestStatus: FC<InitRequestStatusProps> = ({
  request,
  canManage,
  onNewRequest,
}) => {
  const stages = useMembersModalStages();
  const submit = useSubmitRotation();
  const rejected = request.status === 'REJECTED';

  const onCancelAll = async () => {
    try {
      stages.pending();
      await submit.mutateAsync(buildCancelAllPatch());
      stages.success();
    } catch (error) {
      stages.failed(error);
    }
  };

  return (
    <Stack direction="column" gap="md" data-testid="initRequestStatus">
      <Stack direction="column" gap="xxs">
        <Text as="h5" size="sm" weight="bold">
          Cluster member addresses
        </Text>
        <Text size="xs" color="secondary">
          Verify ownership of 4 additional Ethereum addresses in your validator
          cluster.
        </Text>
      </Stack>

      {request.slots.map((proposed, index) =>
        proposed.newAddress ? (
          <ClusterMemberCard
            key={index}
            data-testid={`initPendingCard${index}`}
          >
            <PendingRotation
              title={`Cluster member #${index + 1}`}
              divider={false}
              proposed={proposed}
              rejected={
                rejected
                  ? {
                      comment: request.comments.slots[index] ?? null,
                      reason: request.comments.reason ?? null,
                    }
                  : undefined
              }
            />
          </ClusterMemberCard>
        ) : null,
      )}

      {canManage &&
        (rejected ? (
          <Button
            fullwidth
            onClick={onNewRequest}
            data-testid="newInitRequestButton"
          >
            Submit a new request
          </Button>
        ) : (
          <Button
            fullwidth
            variant="outlined"
            color="error"
            loading={submit.isPending}
            onClick={() => void onCancelAll()}
            data-testid="cancelInitRequestButton"
          >
            Cancel rotation
          </Button>
        ))}
    </Stack>
  );
};
