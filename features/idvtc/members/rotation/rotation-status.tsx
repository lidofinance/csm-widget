import { Button, InlineLoader, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { FormBlock, Stack } from 'shared/components';
import { Address } from 'shared/components/address';
import type { RotationRequestDto } from 'modules/surveys-sdk/generated';

type RotationStatusProps = {
  request: RotationRequestDto;
  canManage: boolean;
  onReplace: () => void;
};

export const RotationStatus: FC<RotationStatusProps> = ({
  request,
  canManage,
  onReplace,
}) => {
  const changedSlots = request.slots.filter((s) => s.newAddress);

  if (request.status === 'REVIEW') {
    return (
      <FormBlock $gap="md" data-testid="rotationStatusReview">
        <Stack align="center" gap="sm">
          <InlineLoader />
          <Text size="sm" weight="bold">
            Rotation request under review ({changedSlots.length})
          </Text>
        </Stack>
        <Text size="xs" color="secondary">
          Your requested member changes are awaiting approval
        </Text>
        {changedSlots.map((slot, i) =>
          slot.newAddress ? (
            <Address key={i} address={slot.newAddress} showIcon />
          ) : null,
        )}
        {canManage && (
          <Button
            size="sm"
            variant="translucent"
            onClick={onReplace}
            data-testid="replaceRequestButton"
          >
            Replace request
          </Button>
        )}
      </FormBlock>
    );
  }

  return (
    <FormBlock $gap="md" data-testid="rotationStatusRejected">
      <Text size="sm" weight="bold" color="error">
        Rotation request rejected
      </Text>
      {request.comments?.reason && (
        <Text size="xs" color="secondary">
          {request.comments.reason}
        </Text>
      )}
      {canManage && (
        <Button size="sm" onClick={onReplace} data-testid="newRequestButton">
          Submit a new request
        </Button>
      )}
    </FormBlock>
  );
};
